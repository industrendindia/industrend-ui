package in.industrend.platform.notification;
import in.industrend.platform.config.RuntimeConfigService;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class Msg91NotificationService implements NotificationService {
  private final RuntimeConfigService config; private final String authKey; private final HttpClient http=HttpClient.newHttpClient();
  public Msg91NotificationService(RuntimeConfigService config,@Value("${app.msg91.auth-key:}") String authKey){this.config=config;this.authKey=authKey;}
  public Delivery sendOtp(String mobile,String otp){
    var provider=config.get("notification.provider","mock"); if("mock".equalsIgnoreCase(provider)) return new Delivery("mock",UUID.randomUUID().toString(),"ACCEPTED");
    var template=config.get("notification.msg91.template_id",""); if(authKey.isBlank()||template.isBlank()) throw new IllegalStateException("MSG91 is enabled but credentials/template are missing");
    try{var base=config.get("notification.msg91.base_url","https://control.msg91.com/api/v5/otp");var url=base+"?template_id="+template+"&mobile="+mobile+"&otp="+otp;
      var req=HttpRequest.newBuilder(URI.create(url)).header("authkey",authKey).POST(HttpRequest.BodyPublishers.noBody()).build();
      var res=http.send(req,HttpResponse.BodyHandlers.ofString()); if(res.statusCode()/100!=2) throw new IllegalStateException("MSG91 rejected OTP request");
      return new Delivery("msg91",null,"ACCEPTED");
    }catch(InterruptedException e){Thread.currentThread().interrupt();throw new IllegalStateException("OTP delivery interrupted",e);}catch(Exception e){throw new IllegalStateException("OTP delivery failed",e);}
  }
}