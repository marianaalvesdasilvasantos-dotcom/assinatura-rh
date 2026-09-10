// ==============================
// CONFIGURAÇÃO
// ==============================

// URL do Google Apps Script
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzUEa8JrXHwN-LuE_XuqVS9dP8vyVK-mQFRTHS-JH8RT3iSPlEJci7RftTpIfqCrTN-/exec";


// ==============================
// CANVAS
// ==============================

const canvas = document.getElementById("assinatura");


// ==============================
// SIGNATURE PAD
// ==============================

const signaturePad = new SignaturePad(canvas, {
    minWidth: 1,
    maxWidth: 2.5,
    penColor: "#000000"
});


// ==============================
// AJUSTAR CANVAS
// ==============================

function ajustarCanvas(preservarAssinatura = true) {

    // Guarda a assinatura atual antes de redimensionar
    let assinatura = null;

    if (preservarAssinatura && !signaturePad.isEmpty()) {
        assinatura = signaturePad.toData();
    }


    const ratio = Math.max(
        window.devicePixelRatio || 1,
        1
    );


    const largura = canvas.offsetWidth;
    const altura = canvas.offsetHeight;


    canvas.width = largura * ratio;
    canvas.height = altura * ratio;


    const contexto = canvas.getContext("2d");

    contexto.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    // Restaura a assinatura
    if (assinatura) {

        signaturePad.fromData(assinatura);

    } else {

        signaturePad.clear();

    }

}


// Ajuste inicial
ajustarCanvas(false);


// ==============================
// EVITAR QUE O CELULAR APAGUE
// A ASSINATURA DURANTE O TOQUE
// ==============================

canvas.addEventListener(
    "touchstart",
    function(event) {
        event.preventDefault();
    },
    { passive: false }
);


canvas.addEventListener(
    "touchmove",
    function(event) {
        event.preventDefault();
    },
    { passive: false }
);


// ==============================
// MENSAGENS
// ==============================

function mostrarMensagem(texto, tipo) {

    const mensagem =
        document.getElementById("mensagem");

    mensagem.textContent = texto;

    mensagem.className = tipo;

}


function limparMensagem() {

    const mensagem =
        document.getElementById("mensagem");

    mensagem.textContent = "";

    mensagem.className = "";

}


// ==============================
// BOTÃO LIMPAR
// ==============================

document
    .getElementById("limpar")
    .addEventListener("click", () => {

        signaturePad.clear();

        limparMensagem();

    });


// ==============================
// BOTÃO ENVIAR
// ==============================

document
    .getElementById("enviar")
    .addEventListener("click", async () => {

        limparMensagem();


        // ==============================
        // PEGAR DADOS
        // ==============================

        const matricula =
            document
                .getElementById("matricula")
                .value
                .trim();


        const tipoDocumento =
            document
                .getElementById("tipoDocumento")
                .value;


        const aceite =
            document
                .getElementById("aceite")
                .checked;


        // ==============================
        // VALIDAR MATRÍCULA
        // ==============================

        if (matricula === "") {

            mostrarMensagem(
                "⚠️ Informe sua matrícula.",
                "erro"
            );

            return;

        }


        // ==============================
        // VALIDAR DOCUMENTO
        // ==============================

        if (tipoDocumento === "") {

            mostrarMensagem(
                "⚠️ Selecione o tipo de documento.",
                "erro"
            );

            return;

        }


        // ==============================
        // VALIDAR ASSINATURA
        // ==============================

        if (signaturePad.isEmpty()) {

            mostrarMensagem(
                "⚠️ Faça sua assinatura antes de enviar.",
                "erro"
            );

            return;

        }


        // ==============================
        // VALIDAR ACEITE
        // ==============================

        if (!aceite) {

            mostrarMensagem(
                "⚠️ Você precisa confirmar a declaração.",
                "erro"
            );

            return;

        }


        // ==============================
        // CONVERTER ASSINATURA
        // ==============================

        const assinatura =
            signaturePad.toDataURL("image/png");


        // ==============================
        // DADOS
        // ==============================

        const dados = {

            matricula: matricula,

            tipoDocumento: tipoDocumento,

            assinatura: assinatura

        };


        // ==============================
        // ENVIAR
        // ==============================

        try {

            const resposta =
                await fetch(URL_SCRIPT, {

                    method: "POST",

                    body: JSON.stringify(dados)

                });


            const resultado =
                await resposta.json();


            // ==============================
            // SUCESSO
            // ==============================

            if (resultado.status === "ok") {

                mostrarMensagem(
                    "✅ Assinatura enviada com sucesso!",
                    "sucesso"
                );


                // Limpar formulário

                document
                    .getElementById("matricula")
                    .value = "";


                document
                    .getElementById("tipoDocumento")
                    .value = "";


                document
                    .getElementById("aceite")
                    .checked = false;


                signaturePad.clear();


            } else {

                mostrarMensagem(

                    "❌ " +
                    (
                        resultado.mensagem ||
                        "O servidor retornou um erro."
                    ),

                    "erro"

                );

            }


        } catch (erro) {

            console.error(erro);

            mostrarMensagem(

                "❌ Erro ao conectar com o servidor.",

                "erro"

            );

        }

    });
