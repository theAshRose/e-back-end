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

router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update product data
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ product_id }) => product_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});
//res.status(200).json({message: "Success! Changed tag with id of "+req.params.id+"to name: "+req.body.tag_name})
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy(
      {
        where: {
          id: req.params.id
        }
      }    
    );
  res.status(200).json({message: "DESTROYED id of "+req.params.id+" from the Tag database!"})
  } catch (err) {
    res.status(500).json(err)
  }
});
// delete on tag by its `id` value
module.exports = router;
