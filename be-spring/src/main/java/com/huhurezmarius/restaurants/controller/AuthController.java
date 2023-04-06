package com.huhurezmarius.restaurants.controller;

import com.huhurezmarius.restaurants.enums.RoleEnum;
import com.huhurezmarius.restaurants.enums.TypeEnum;
import com.huhurezmarius.restaurants.jwtutil.JwtUtils;
import com.huhurezmarius.restaurants.model.*;
import com.huhurezmarius.restaurants.repository.EmailConfirmationTokenRepository;
import com.huhurezmarius.restaurants.repository.RoleRepository;
import com.huhurezmarius.restaurants.repository.TypeRepository;
import com.huhurezmarius.restaurants.repository.UserRepository;
import com.huhurezmarius.restaurants.request.FacebookRequest;
import com.huhurezmarius.restaurants.request.LoginRequest;
import com.huhurezmarius.restaurants.request.SignupRequest;
import com.huhurezmarius.restaurants.response.JwtResponse;
import com.huhurezmarius.restaurants.response.MessageResponse;
import com.huhurezmarius.restaurants.service.EmailSenderService;
import com.huhurezmarius.restaurants.service.UserDetailsImpl;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    UserRepository userRepository;
    @Autowired
    EmailConfirmationTokenRepository emailConfirmationTokenRepository;
    @Autowired
    EmailSenderService emailSenderService;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    TypeRepository typeRepository;
    @Autowired
    JwtUtils jwtUtils;

    @ApiResponse()
    @GetMapping("/authenticate")
    public ResponseEntity<?> checkIfUserIsStillLoggedIn(@RequestParam("userName") String username)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication != null && authentication.getName().equals(username)) {
            return ResponseEntity.ok("User is logged in");
        }
        else return ResponseEntity.badRequest().body("User is not logged in");
    }
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + loginRequest.getUsername()));

        if(!user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Account was not verified yet"));
        }

        if(user.isBlocked()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new MessageResponse("Error: Account was blocked"));
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        Set<Role> roles = new HashSet<Role>();
        Set<Type> types = new HashSet<Type>();

        roles.add(roleRepository.findByName(RoleEnum.ROLE_USER));
        types.add(typeRepository.findByName(TypeEnum.EMAIL));

        user.setRoles(roles);
        user.setTypes(types);
        user.setEnabled(false);
        userRepository.save(user);

        EmailConfirmationToken confirmationToken = new EmailConfirmationToken(user);
        emailConfirmationTokenRepository.save(confirmationToken);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getEmail());
        mailMessage.setSubject("Verify account!");
        mailMessage.setFrom("alevasluiale@gmail.com");
        mailMessage.setText("To confirm your account, please click here : " +
                "http://localhost:8080/auth/confirm-account?token="+confirmationToken.getConfirmationToken());

        emailSenderService.sendEmail(mailMessage);
        return ResponseEntity.ok("Confirmation email was sent!");
    }

    @RequestMapping(value="/confirm-account",method = {RequestMethod.GET,RequestMethod.POST})
    public ResponseEntity<?> confirmUserAccount(@RequestParam("token") String confirmationToken) {
        EmailConfirmationToken token = emailConfirmationTokenRepository.findByConfirmationToken(confirmationToken);
        if(token != null) {
            User user = userRepository.findByEmailIgnoreCase(token.getUser().getEmail());
            user.setEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok("Account was verified successfully.");
        }
        else return ResponseEntity.badRequest().body(new MessageResponse("Error: The link is invalid or broken!"));
    }


    @PostMapping("/facebook-signIn")
    public ResponseEntity<?> signInWithFacebook(@RequestBody FacebookRequest userDetails) {

        if(userDetails.getAccessToken() == null || userDetails.getAccessToken().isBlank() || userDetails.getAccessToken().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error :Facebook auth failed"));
        }
        User currentUser = userRepository.findByEmailIgnoreCase(userDetails.getEmail());
        if(currentUser == null) {
            User user = new User();
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setPhotoUrl(userDetails.getPhotoUrl());
            user.setBlocked(false);
            Set<Role> roles = new HashSet<Role>();
            Set<Type> types = new HashSet<Type>();

            roles.add(roleRepository.findByName(RoleEnum.ROLE_USER));
            types.add(typeRepository.findByName(TypeEnum.FACEBOOK));

            user.setRoles(roles);
            user.setTypes(types);
            user.setEnabled(true);
            user.setFacebookToken(encoder.encode(userDetails.getAccessToken()));
            currentUser = userRepository.save(user);
        }


        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(currentUser.getUsername(),currentUser.getFacebookToken(),
                        currentUser.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                        .collect(Collectors.toList())));

        String jwt = jwtUtils.generateJwtTokenFromUsername(SecurityContextHolder.getContext().getAuthentication());


        List<String> roles = currentUser.getRoles().stream()
                .map(item -> item.getName().name())
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt,
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                roles));
    }
}
