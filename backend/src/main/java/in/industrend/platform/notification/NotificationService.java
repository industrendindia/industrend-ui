package in.industrend.platform.notification;
public interface NotificationService { Delivery sendOtp(String mobile, String otp); record Delivery(String provider,String messageId,String status){} }