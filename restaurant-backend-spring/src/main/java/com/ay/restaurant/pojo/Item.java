package com.ay.restaurant.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

@NamedQuery(name = "Item.findAllItems", query = "select new com.ay.restaurant.dto.ItemDto(i.id,i.name,i.description,i.price,i.status,i.category.id,i.category.name) from Item i order by i.id")
@NamedQuery(name = "Item.findByCategory", query = "select new com.ay.restaurant.dto.ItemDto(i.id,i.name,i.description,i.price,i.status,i.category.id,i.category.name, i.image) from Item i where i.category.id=:id and i.status='true'")
@NamedQuery(name = "Item.findItemById", query = "select new com.ay.restaurant.dto.ItemDto(i.id,i.name,i.description,i.price,i.status,i.category.id,i.category.name) from Item i where i.id=:id")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "item")
public class Item implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Double price;

    @Column(name = "status")
    private String status;

    @Column(name = "image")
    private byte[] image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_fk", nullable = false)
    private Category category;

}
