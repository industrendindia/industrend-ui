package in.industrend.platform.config;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
@Service
public class RuntimeConfigService {
  private record Entry(String value, Instant expiresAt) {}
  private final JdbcClient jdbc; private final Map<String, Entry> cache = new ConcurrentHashMap<>();
  public RuntimeConfigService(JdbcClient jdbc) { this.jdbc = jdbc; }
  public String get(String key, String fallback) {
    var item=cache.get(key); if(item!=null && item.expiresAt().isAfter(Instant.now())) return item.value();
    var value=jdbc.sql("select config_value from industrendindia.app_config where config_key=:key").param("key",key).query(String.class).optional().orElse(fallback);
    cache.put(key,new Entry(value,Instant.now().plus(Duration.ofSeconds(30)))); return value;
  }
  public int getInt(String key,int fallback){ try{return Integer.parseInt(get(key,Integer.toString(fallback)));}catch(Exception e){return fallback;} }
  public void evict(String key){cache.remove(key);}
}