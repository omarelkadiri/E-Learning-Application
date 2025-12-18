package ccn.elkadiri.applicationelearning;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class ElearningController {

    // Endpoint public
    @GetMapping("/public/hello")
    public String publicHello() {
        return "Hello (public endpoint)";
    }

    // Retourne tous les claims du token (comme dans le doc, page 34)
    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return jwt.getClaims();
    }

    // Liste des cours – accessible aux ADMIN et STUDENT
    @GetMapping("/courses")
    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    public List<Map<String, Object>> getCourses(@AuthenticationPrincipal Jwt jwt) {
        String username = (String) jwt.getClaims().get("preferred_username");
        return List.of(
                Map.of("id", 1, "title", "Spring Security & Keycloak", "student", username),
                Map.of("id", 2, "title", "React & OAuth2", "student", username)
        );
    }

    // Création d'un cours – ADMIN uniquement
    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Object> createCourse(@RequestBody Map<String, Object> payload,
                                            @AuthenticationPrincipal Jwt jwt) {
        // Simule l'enregistrement
        payload.put("createdBy", jwt.getClaims().get("preferred_username"));
        return payload;
    }
}
