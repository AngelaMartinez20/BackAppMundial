import { Router } from "express";
import { authenticateUser, authorizeRoles } from "../middlewares/authenticateUser";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/inventory.controller";

const router = Router();

router.get("/", authenticateUser, authorizeRoles("admin", "cajero"), getProducts);
router.post("/", authenticateUser, authorizeRoles("admin"), createProduct);
router.put("/", authenticateUser, authorizeRoles("admin"), updateProduct);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteProduct);

export default router;
