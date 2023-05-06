package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@ComponentScan("org.example")
public class MindMendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MindMendApplication.class,args);
    }
}