package org.example.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@PropertySource("classpath:application.properties")
public class SwaggerToConfig {
    @Autowired
    private Environment environment;
    @Bean
    public Docket WOWAcquirerApi(){
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                //      .apis(RequestHandlerSelectors.basePackage("com.wowapi.cacis"))
                //      .paths(PathSelectors.regex("/.*"))
                .apis(RequestHandlerSelectors.basePackage("com.example.controller"))
                .paths(PathSelectors.any())
                .build();
    }
}
