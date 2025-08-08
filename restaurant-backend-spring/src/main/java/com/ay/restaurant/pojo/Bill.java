package com.ay.restaurant.pojo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;
import java.util.Date;

@NamedQuery(name = "Bill.findAllBills", query = "select b from Bill b order by b.id desc")
@NamedQuery(name = "Bill.findBillByUsername", query = "select b from Bill b where b.createdBy=:username order by b.id desc")

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "bill")
public class Bill implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "issueDate")
    private Date issueDate;

    @Column(name = "paymentMethod")
    private String paymentMethod;

    @Column(name = "total", scale = 2)
    private Double total;

    @Column(name = "itemDetails", columnDefinition = "json")
    private String itemDetails;

    @Column(name = "createdBy")
    private String createdBy;

    @Column(name = "pdf")
    private byte[] pdf;

}