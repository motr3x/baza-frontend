package ru.baza.backend.service;

import org.springframework.stereotype.Service;
import ru.baza.backend.entity.Image;
import ru.baza.backend.repository.ImageRepository;

import java.util.List;
@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public List<Image> getAllImage(){
        return imageRepository.findAll();
    }
}
