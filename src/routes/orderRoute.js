const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  filterOrderForStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderToCancel,
  checkoutSession,
  createCashOrderBCartId,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

//router.use(authService.protect);

router.get(
  "/status/:orderStatus",
  //authService.protect,
  //authService.allowedTo("admin","company","user"),
  filterOrderForLoggedUser,
  filterOrderForStatus,
  findAllOrders
);

router.get(
  "/checkout-session/:cartId",
   //authService.protect,
  //authService.allowedTo("admin","company","user"),
  checkoutSession
);

router.route("/:cartId")
.post(
  authService.protect,
  authService.allowedTo("admin","company","user"),
   createCashOrder
   );

   router.route("/:guestId/bycart/:cartId")
.post(
  //authService.protect,
  //authService.allowedTo("admin","company","user"),
  createCashOrderBCartId
   );

 

router.get(
  "/",
  //authService.protect,
  //authService.allowedTo("admin","company","user"),
  filterOrderForLoggedUser,
  findAllOrders
);

router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
   //authService.protect,
  //authService.allowedTo("admin","company","user"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  //authService.protect,
  //authService.allowedTo("admin","company","user"),
  updateOrderToDelivered
);
router.put(
  "/:id/cancel",
  //authService.protect,
  //authService.allowedTo("admin","company","user"),
  updateOrderToCancel
);

module.exports = router;
