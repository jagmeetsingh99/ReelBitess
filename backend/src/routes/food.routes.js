const express=require('express');
const foodController= require('../controllers/food.controller')
const authmiddleware= require('../middlewares/auth.middleware')
const router= express.Router();
const multer =require('multer')

const upload = multer({
    storage : multer.memoryStorage(),
})


//post api/food{protected}
router.post('/',authmiddleware.authFoodPartnerMiddleware,upload.single('video'),foodController.createFood)

router.get("/",authmiddleware.authUserMiddleware,foodController.getFoodItems);

router.post("/like",authmiddleware.authUserMiddleware,foodController.likeFood);


router.get("/save", authmiddleware.authUserMiddleware, foodController.getSaveFood); 
router.post("/save", authmiddleware.authUserMiddleware, foodController.saveFood);   


module.exports=router;