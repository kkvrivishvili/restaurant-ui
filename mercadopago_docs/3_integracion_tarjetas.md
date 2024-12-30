# 2. Integración de Pagos con Tarjeta

## Importar MercadoPago.js

Para comenzar la integración, es necesario importar la biblioteca MercadoPago.js:

```bash
npm install @mercadopago/sdk-js
```

## Configurar Credenciales

```javascript
import { loadMercadoPago } from "@mercadopago/sdk-js";

await loadMercadoPago();
const mp = new window.MercadoPago("YOUR_PUBLIC_KEY");
```

## Añadir Formulario de Pago

### Estructura HTML
```html
<form id="form-checkout">
  <div id="form-checkout__cardNumber" class="container"></div>
  <div id="form-checkout__expirationDate" class="container"></div>
  <div id="form-checkout__securityCode" class="container"></div>
  <input type="text" id="form-checkout__cardholderName" />
  <select id="form-checkout__issuer"></select>
  <select id="form-checkout__installments"></select>
  <select id="form-checkout__identificationType"></select>
  <input type="text" id="form-checkout__identificationNumber" />
  <input type="email" id="form-checkout__cardholderEmail" />
  <button type="submit" id="form-checkout__submit">Pagar</button>
  <progress value="0" class="progress-bar">Cargando...</progress>
</form>
```

### Estilos Básicos
```css
#form-checkout {
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.container {
  height: 18px;
  display: inline-block;
  border: 1px solid rgb(118, 118, 118);
  border-radius: 2px;
  padding: 1px 2px;
}
```

## Inicializar Formulario de Pago

```javascript
const cardForm = mp.cardForm({
  amount: "100.5",
  iframe: true,
  form: {
    id: "form-checkout",
    cardNumber: {
      id: "form-checkout__cardNumber",
      placeholder: "Numero de tarjeta",
    },
    expirationDate: {
      id: "form-checkout__expirationDate",
      placeholder: "MM/YY",
    },
    securityCode: {
      id: "form-checkout__securityCode",
      placeholder: "Código de seguridad",
    },
    cardholderName: {
      id: "form-checkout__cardholderName",
      placeholder: "Titular de la tarjeta",
    },
    issuer: {
      id: "form-checkout__issuer",
      placeholder: "Banco emisor",
    },
    installments: {
      id: "form-checkout__installments",
      placeholder: "Cuotas",
    },
    identificationType: {
      id: "form-checkout__identificationType",
      placeholder: "Tipo de documento",
    },
    identificationNumber: {
      id: "form-checkout__identificationNumber",
      placeholder: "Número del documento",
    },
    cardholderEmail: {
      id: "form-checkout__cardholderEmail",
      placeholder: "E-mail",
    },
  },
  callbacks: {
    onFormMounted: error => {
      if (error) console.warn("Form Mounted handling error: ", error);
      console.log("Form mounted");
    },
    onSubmit: event => {
      event.preventDefault();
      const cardData = cardForm.getCardFormData();
      processPayment(cardData);
    },
    onFetching: (resource) => {
      const progressBar = document.querySelector(".progress-bar");
      progressBar.removeAttribute("value");
      return () => {
        progressBar.setAttribute("value", "0");
      };
    }
  },
});
```

## Enviar Pago

### Procesamiento en Backend
```javascript
const processPayment = async (cardData) => {
  try {
    const response = await fetch("/process_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: cardData.token,
        issuer_id: cardData.issuer_id,
        payment_method_id: cardData.payment_method_id,
        transaction_amount: Number(cardData.amount),
        installments: Number(cardData.installments),
        description: "Descripción del producto",
        payer: {
          email: cardData.email,
          identification: {
            type: cardData.identificationType,
            number: cardData.identificationNumber,
          },
        },
      }),
    });
    const result = await response.json();
    handlePaymentResponse(result);
  } catch (error) {
    console.error("Error processing payment:", error);
  }
};
```

### Manejo de Respuestas
Es importante manejar las diferentes respuestas que puede devolver el proceso de pago:
- Pago aprobado: status "approved"
- Pago en proceso: status "in_process"
- Pago rechazado: status "rejected"