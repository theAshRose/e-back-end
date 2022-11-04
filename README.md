# e-back-end

## Description

Here we have a wonderful, wonderful sequelize database app. It is fully backend, so you will need to follow instructions detailed below in 'how-to-use'.
With this tool you may update a database! Enjoy!

## How to use

You will need to create a .env file and initiate mySQL as seen in this [video](https://youtu.be/rEool94YysA). Follow all steps to reproduce the post, update, get and delete requests.

## Screenshot of app result

![screenshot](https://cdn.discordapp.com/attachments/408481106040717322/1037963827192532992/unknown.png)

## the Code!
Here we are showcasing the many-to-many relationships defined in our models/index.js


```
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  otherKey: 'tag_id'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
  otherKey: 'product_id'
});

```

## Author Links
[Linkedin](https://www.linkedin.com/in/dominic-conradson-76638b172/)---
[GitHub](https://github.com/theDomConrad/)---
[Portfolio](https://thedomconrad.github.io/Dominic-Conradson-Portfolio/)---
