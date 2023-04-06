package com.huhurezmarius.restaurants.controller;


import com.huhurezmarius.restaurants.enums.RoleEnum;
import com.huhurezmarius.restaurants.enums.StatusEnum;
import com.huhurezmarius.restaurants.model.*;
import com.huhurezmarius.restaurants.repository.*;
import com.huhurezmarius.restaurants.request.MealRequest;
import com.huhurezmarius.restaurants.request.OrderRequest;
import com.huhurezmarius.restaurants.request.OrderStatusRequest;
import com.huhurezmarius.restaurants.response.MessageResponse;
import com.huhurezmarius.restaurants.response.OrderResponseNoRestaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderStatusRepository orderStatusRepository;
    @Autowired
    private MealRepository mealRepository;
    @Autowired
    private OrderMealRepository orderMealRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StatusRepository statusRepository;
    @GetMapping("/getAll")
    List<OrderResponseNoRestaurant> getAllOrders() {
        return orderRepository.findBy();
    }

    @GetMapping("/getAllForUser")
    List<OrderResponseNoRestaurant> getAllForUser(@RequestParam("userId") Long userId) {
        return orderRepository.findByUsersId(userId);
    }
    @GetMapping("/getAllForOwner")
    List<OrderResponseNoRestaurant> getAllForOwner(@RequestParam("userId") Long userId) throws Exception {
        User user = userRepository.getOne(userId);
        if(user == null || !user.getRoles().contains(roleRepository.findByName(RoleEnum.ROLE_OWNER))) {
            throw new Exception("User is not owner");
        }
        List<OrderResponseNoRestaurant> response = new ArrayList<>();
        for(Restaurant rr : user.getRestaurants()) {
            response.addAll(orderRepository.findByRestaurantsId(rr.getId()));
        }
        return response;
    }
    @PostMapping("/addOrder")
    public ResponseEntity<?> addOrder(@Valid @RequestBody OrderRequest orderRequest) {

        if(orderRequest.getMeals().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: An order needs at least 1 meal!"));
        }
        Order order = new Order();
        order.setDate(new Date());

        Set<User> users = new HashSet<>();
        users.add(userRepository.getOne(orderRequest.getUserId()));

        order.setUsers(users);

        Set<Restaurant> restaurantSet = new HashSet<Restaurant>();
        restaurantSet.add(restaurantRepository.getOne(orderRequest.getRestaurantId()));
        order.setRestaurants(restaurantSet);

        double totalAmount = 0;
        for(MealRequest mealRequest : orderRequest.getMeals()) {
            totalAmount += mealRequest.getQuantity()*mealRequest.getPrice();
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        for(MealRequest mealRequest : orderRequest.getMeals()) {
            if(!mealRepository.existsById(mealRequest.getId())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Meal with id "+mealRequest.getId()+" doesn't exist"));
            }
            OrderMeal orderMeal = new OrderMeal(new OrderMealPK(order.getId(),mealRequest.getId()));
            orderMeal.setMeal(mealRepository.getOne(mealRequest.getId()));
            orderMeal.setOrder(order);
            orderMeal.setQuantity(mealRequest.getQuantity());
            orderMealRepository.save(orderMeal);
        }
        Status status = statusRepository.findByName(StatusEnum.PLACED);
        OrderStatus orderStatus = new OrderStatus(new OrderStatusPK(savedOrder.getId(),status.getId()));
        orderStatus.setOrder(savedOrder);
        orderStatus.setStatus(status);
        orderStatus.setDate(new Date());
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok("Order added successfully");
    }
    @PostMapping("/updateOrderStatus")
    public ResponseEntity<?> updateOrderStatus(@Valid @RequestBody OrderStatusRequest request) {
        Order order = orderRepository.getOne(request.getOrderId());
        if(order == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Order doesn't exist"));
        }
        Status status = null;
        if(request.getStatus().equals(StatusEnum.CANCELED.name())) {
            if(order.getOrderStatuses().size() == 1
                    && order.getOrderStatuses()
                    .contains(orderStatusRepository.findByOrderAndStatus(order,statusRepository.findByName(StatusEnum.PLACED)))) {
                status = statusRepository.findByName(StatusEnum.CANCELED);
            }
            else return ResponseEntity.badRequest().body(new MessageResponse("Error: Only placed orders can be canceled"));
        }
        else if(request.getStatus().equals(StatusEnum.PROCESSING.name())) {
            if(order.getOrderStatuses().size() == 1
                    && order.getOrderStatuses()
                    .contains(orderStatusRepository.findByOrderAndStatus(order,statusRepository.findByName(StatusEnum.PLACED)))) {
                status = statusRepository.findByName(StatusEnum.PROCESSING);
            }
            else return ResponseEntity.badRequest().body(new MessageResponse("Error: Only placed orders can be processed"));
        }
        else if(request.getStatus().equals(StatusEnum.IN_ROUTE.name())) {
            if(order.getOrderStatuses().size() == 2
                    && order.getOrderStatuses()
                    .contains(orderStatusRepository.findByOrderAndStatus(order,statusRepository.findByName(StatusEnum.PROCESSING)))) {
                status = statusRepository.findByName(StatusEnum.IN_ROUTE);
            }
            else return ResponseEntity.badRequest().body(new MessageResponse("Error: Only processed orders can be shipped"));
        }
        else if(request.getStatus().equals(StatusEnum.DELIVERED.name())) {
            if(order.getOrderStatuses().size() == 3
                    && order.getOrderStatuses()
                    .contains(orderStatusRepository.findByOrderAndStatus(order,statusRepository.findByName(StatusEnum.IN_ROUTE)))) {
                status = statusRepository.findByName(StatusEnum.DELIVERED);
            }
            else return ResponseEntity.badRequest().body(new MessageResponse("Error: Only in route orders can be delivered"));
        }
        else if(request.getStatus().equals(StatusEnum.RECEIVED.name()))  {
            if(order.getOrderStatuses().size() == 4
                    && order.getOrderStatuses()
                    .contains(orderStatusRepository.findByOrderAndStatus(order,statusRepository.findByName(StatusEnum.DELIVERED)))) {
                status = statusRepository.findByName(StatusEnum.RECEIVED);
            }
            else return ResponseEntity.badRequest().body(new MessageResponse("Error: Only delivered orders can be received"));
        }

        OrderStatus orderStatus = new OrderStatus(new OrderStatusPK(order.getId(),status.getId()));
        orderStatus.setOrder(order);
        orderStatus.setStatus(status);
        orderStatus.setDate(new Date());
        orderStatusRepository.save(orderStatus);

        order.addOrderStatus(orderStatus);
        orderRepository.save(order);

        return ResponseEntity.ok("Status updated with success!");
    }
//    @PostMapping("/updateOrder")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
//    public ResponseEntity<?> updateOrder(@Valid @RequestBody OrderRequest orderRequest, @RequestParam(name="orderId") Long orderId) {
//        if(!orderRepository.existsById(orderId)){
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Order does not exists!"));
//        }
//
//        Order order = orderRepository.getOne(orderId);
//
//        if(orderRequest.getName() != null && !orderRequest.getName().isEmpty() && !orderRequest.getName().isBlank()) {
//            order.setName(orderRequest.getName());
//        }
//        if(orderRequest.getDescription() != null && !orderRequest.getDescription().isEmpty() && !orderRequest.getDescription().isBlank()) {
//            order.setDescription(orderRequest.getDescription());
//        }
//        if(orderRequest.getPrice() != null ) {
//            order.setPrice(orderRequest.getPrice().doubleValue());
//        }
//        orderRepository.save(order);
//
//        return ResponseEntity.ok("Order updated successfully");
//    }
//
//    @PutMapping("/deleteOrder")
//    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
//    public ResponseEntity<?> updateOrder(@RequestParam(name="orderId") Long orderId) {
//        if (!orderRepository.existsById(orderId)) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Order does not exists!"));
//        }
//
//        orderRepository.deleteById(orderId);
//        return ResponseEntity.ok("Order deleted successfully");
//    }
}
