const path = require('path');
const fs = require('fs');
const {users,products} = require ('../database/models');
const { Op, where } = require("sequelize");

module.exports = {
    show : async  (req,res) => {
        const user= await users.findByPk(req.params.id, {include: ['products']})
        const product = await products.findAll({where: {user_id: req.params.id,  name_product: {
          [Op.ne]: '%null%' }}, order: [['createdAt', 'DESC']]})
    res.render(path.resolve(__dirname, '..','views', 'adminProducts'),{user,product});
  },

save : async  (req,res) => {
  
 
  const user = await users.findByPk(req.params.id, {include: ['products']})
  const product = await products.findOne({where:{user_id:req.params.id}})

  let product_body={
    name_product: req.body.name_product,
    tipo_envio: req.body.tipo_envio,
    place: req.body.place,
    n_tracking: req.body.n_tracking,
    weight: req.body.weight,
    date_state:req.body.date_state,
    user: user.first_name + " "+ user.last_name,
    entrega:req.body.entrega
  }; 

  let newproduct = {
    user_id: user.id,
    name_product: req.body.name_product,
    tipo_envio: req.body.tipo_envio,
    place: req.body.place,
    n_tracking: req.body.n_tracking,
    coments: req.body.coments,
    weight: req.body.weight,
    date_state:req.body.date_state,
    user: user.first_name + " "+ user.last_name,
    entrega:req.body.entrega
   
  }
  let  nombre = await product.name_product;

  if (nombre == null) {
   
    await products.update(product_body, {where: {user_id: req.params.id}})
  } else {
    await products.create(newproduct)
  }
  res.redirect(`/adminproducts/${user.id}`)
  },
  update: async  (req,res) => {
    const product = await products.findOne({where:{id:req.params.id}})
    const user = await users.findAll({where: {id: product.user_id }})
 
   
    //return res.send(usuario)
res.render(path.resolve(__dirname, '..','views', 'editproduct'),{product,user});
},
updatesave: async  (req,res) => {
  const product = await products.findOne({where:{id:req.params.id}})
  const usuario = await users.findAll({where: {id: product.user_id }})
  let product_body={
    name_product: req.body.name_product,
    tipo_envio: req.body.tipo_envio,
    place: req.body.place,
    n_tracking: req.body.n_tracking,
    weight: req.body.weight,
    coments: req.body.coments,
    date_state:req.body.date_state,
    user: usuario.first_name + " "+ usuario.last_name,
    entrega:req.body.entrega

  }; 
  await product.update(product_body, {where: {id: req.params.id}})
  //return res.send(usuario)
  res.redirect(`/adminproducts/${product.user_id}`)
},
delete : async  (req,res) => {
  
  const product = await products.findByPk(req.params.id)
  const usuario= await users.findOne({where:{id:product.user_id}})
  const productos = await products.findAll({where:{user_id:product.user_id}})
  if (productos.length==1) {
    await product.destroy({where: {id: req.params.id}})
    let usuario_body = {user_id:usuario.id};

    await products.create(usuario_body);
  } else {
    await products.destroy({where: {id: req.params.id}})
  }

  res.redirect(`/adminproducts/${product.user_id}`);
},
allproducts : async  (req,res) => {
  const product = await products.findAll({where:{name_product: {
    [Op.ne]: '%null%' }}})
 let prodw = 0;
product.forEach(producto => {
 
  prodw = producto.weight + prodw
  return prodw
});

res.render(path.resolve(__dirname, '..','views', 'allproducts'),{product,prodw});
},
allproductsx : async  (req,res) => {
  const product = await products.findAll( {where: {entrega:"NO entregado"}},{name_product: {
    [Op.ne]: '%null%' }})
 let prodw = 0;
product.forEach(producto => {
 
  prodw = producto.weight + prodw
  return prodw
});

res.render(path.resolve(__dirname, '..','views', 'allproducts'),{product,prodw});
},
allproductstic : async  (req,res) => {
  const product = await products.findAll( {where: {entrega:"entregado"}},{name_product: {
    [Op.ne]: '%null%' }})
 let prodw = 0;
product.forEach(producto => {
 
  prodw = producto.weight + prodw
  return prodw
});

res.render(path.resolve(__dirname, '..','views', 'allproducts'),{product,prodw});
},
}