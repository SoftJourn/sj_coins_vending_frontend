import { Field } from "../shared/machine";
import { Product } from "../../shared/entity/product";

export interface UpdateFieldDTO {
  field: Field;
  product: Product;
  count: number;
}
