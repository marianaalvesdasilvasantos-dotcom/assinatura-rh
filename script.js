// ==============================
// CONFIGURAÇÃO
// ==============================

// URL do Google Apps Script
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzUEa8JrXHwN-LuE_XuqVS9dP8vyVK-mQFRTHS-JH8RT3iSPlEJci7RftTpIfqCrTN-/exec";

// Nome do documento/formulário
const DOCUMENTO = "Troca de Plantão";


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

function ajustarCanvas() {

    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    canvas.getContext("2d").scale(ratio, ratio);

    signaturePad.clear();

}

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();


// ==============================
// MENSAGENS
// ==============================

function mostrarMensagem(texto, tipo) {

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = texto;
    mensagem.className = tipo;

}


function limparMensagem() {

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";
    mensagem.className = "";

}


// ==============================
// BOTÃO LIMPAR
// ==============================

document.getElementById("limpar").addEventListener("click", () => {

    signaturePad.clear();

    limparMensagem();

});


// ==============================
// BOTÃO ENVIAR
// ==============================

document.getElementById("enviar").addEventListener("click", async () => {

    limparMensagem();

    const matricula = document.getElementById("matricula").value.trim();

    const aceite = document.getElementById("aceite").checked;


    // ==============================
    // VALIDAÇÃO DA MATRÍCULA
    // ==============================

    if (matricula === "") {

        mostrarMensagem(
            "⚠️ Informe sua matrícula.",
            "erro"
        );

        return;

    }


    // ==============================
    // VALIDAÇÃO DA ASSINATURA
    // ==============================

    if (signaturePad.isEmpty()) {

        mostrarMensagem(
            "⚠️ Faça sua assinatura antes de enviar.",
            "erro"
        );

        return;

    }


    // ==============================
    // VALIDAÇÃO DO ACEITE
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

    const assinatura = signaturePad.toDataURL("image/png");


    // ==============================
    // DADOS ENVIADOS AO SERVIDOR
    // ==============================

    const dados = {

        matricula: matricula,

        assinatura: assinatura,

        documento: DOCUMENTO

    };


    // ==============================
    // ENVIAR PARA O GOOGLE APPS SCRIPT
    // ==============================

    try {

        const resposta = await fetch(URL_SCRIPT, {

            method: "POST",

            body: JSON.stringify(dados)

        });


        const resultado = await resposta.json();


        // ==============================
        // SUCESSO
        // ==============================

        if (resultado.status === "ok") {

            mostrarMensagem(
                "✅ Assinatura enviada com sucesso!",
                "sucesso"
            );


            document.getElementById("matricula").value = "";

            document.getElementById("aceite").checked = false;

            signaturePad.clear();


        } else {


            // ==============================
            // ERRO RETORNADO PELO SERVIDOR
            // ==============================

            mostrarMensagem(

                "❌ " +
                (resultado.mensagem ||
                "O servidor retornou um erro."),

                "erro"

            );

        }


    } catch (erro) {


        // ==============================
        // ERRO DE CONEXÃO
        // ==============================

        console.error(erro);

        mostrarMensagem(

            "❌ Erro ao conectar com o servidor.",

            "erro"

        );

    }

});
