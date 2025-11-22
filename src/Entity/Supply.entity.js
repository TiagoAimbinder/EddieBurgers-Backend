

export class ESupply {

  constructor({ sup_id, sup_name, sup_price }) {
    this.sup_id = sup_id ?? null; 
    this.sup_name = sup_name ? sup_name.trim() : null;
    this.sup_price = sup_price ? sup_price : null; 
  }

  get dto() {
    return {
      sup_id: this.sup_id,
      sup_name: this.sup_name,
      sup_price: this.sup_price,
    }
  }


  validateID = () => {
    let value = this.sup_id; 

    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "string") value = value.trim();
    if (value === "" || value === null) throw { statusCode: 400, message: "El ID no puede estar vacío." };

    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw { statusCode: 400, message: "El ID debe ser un entero mayor a 0." };
    return id;
  };

  validatePrice = () => {
    let value = this.sup_price; 
    if (value === null || value === undefined || value === "") throw { statusCode: 400, message: "El precio es obligatorio." };
    if (typeof value === "string") value = value.trim();

    const price = Number(value);

    if ( isNaN(price) || !isFinite(price) || typeof price !== "number") throw { statusCode: 400, message: "El precio debe ser un número válido." };
    if (price < 0) throw { statusCode: 400, message: "El precio no puede ser negativo." };

    return price;
  };

  validateName = () => {
    let value = this.sup_name; 
    if (value === undefined || value === null) throw { statusCode: 400, message: "El nombre es obligatorio." };
    if (typeof value !== "string") throw { statusCode: 400, message: "El nombre debe ser texto." };

    const name = value.trim();
    if (name.length === 0) throw { statusCode: 400, message: "El nombre no puede estar vacío." };
    // Solo letras, números, espacios, y algunos símbolos útiles

    const validPattern = /^[A-Za-z0-9ÁÉÍÓÚáéíóúñÑ()\-.,\s]{2,50}$/;
    if (!validPattern.test(name)) throw { statusCode: 400, message:"El nombre contiene caracteres inválidos o es demasiado corto/largo.",};

    return name;
  };
}


