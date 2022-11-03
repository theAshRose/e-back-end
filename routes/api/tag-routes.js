const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll(
      {
        include: [
          {
            model: Product,
            through: ProductTag
          }
        ]
      }
    );
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
    // find all tags
    // be sure to include its associated Product data
  });

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id,
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  // create a new tag
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id
        }
      }, 
    ); 
    // update a tag's name by its `id` value
  res.status(200).json({message: "Success! Changed tag with id of "+req.params.id+"to name: "+req.body.tag_name})
  } catch (err) {
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy(
      {
        where: {
          id: req.params.id
        }
      }    
    );
  res.status(200).json({message: "DESTROYED id of "+req.params.id+"from the Tag database!"})
  } catch (err) {
    res.status(500).json(err)
  }
});
// delete on tag by its `id` value
module.exports = router;
