package ru.baza.backend.controllers;

import org.springframework.web.bind.annotation.*;
import ru.baza.backend.entity.Image;
import ru.baza.backend.service.ImageService;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @CrossOrigin(origins = {"*"})
    @GetMapping("/gallery")
    public List<Image> getAll(){
        return imageService.getAllImage();
    }
}
