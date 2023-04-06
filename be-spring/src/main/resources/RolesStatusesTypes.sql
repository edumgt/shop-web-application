insert into dbo.types(name) values('EMAIL');
insert into dbo.types(name) values('FACEBOOK');
insert into dbo.types(name) values('GOOGLE')
insert into dbo.roles(name) values('ROLE_USER');
insert into dbo.roles(name) values('ROLE_OWNER');
insert into dbo.roles(name) values('ROLE_ADMIN');
insert into dbo.statuses(name) values('PLACED');
insert into dbo.statuses(name) values('CANCELED');
insert into dbo.statuses(name) values('PROCESSING');
insert into dbo.statuses(name) values('IN_ROUTE');
insert into dbo.statuses(name) values('DELIVERED');
insert into dbo.statuses(name) values('RECEIVED');

update dbo.user_role
	set role_id = 2
	where user_id = 1