package in.industrend.platform.auth;
import static org.assertj.core.api.Assertions.*;import org.junit.jupiter.api.Test;
class SecurityTokensTest {
  @Test void otpIsAlwaysSixDigits(){var s=new SecurityTokens("test-pepper");for(int i=0;i<100;i++)assertThat(s.otp()).matches("[0-9]{6}");}
  @Test void hashesArePepperedAndComparedConstantTime(){var s=new SecurityTokens("test-pepper");var h=s.hash("value");assertThat(h).hasSize(64);assertThat(s.matches(h,"value")).isTrue();assertThat(s.matches(h,"other")).isFalse();}
  @Test void normalisesIndianMobile(){assertThat(AuthService.normaliseMobile("+91 93564 19345")).isEqualTo("+919356419345");assertThatThrownBy(()->AuthService.normaliseMobile("123")).isInstanceOf(IllegalArgumentException.class);}
}