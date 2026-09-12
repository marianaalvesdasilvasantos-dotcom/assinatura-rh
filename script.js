// ==================================================
// CONFIGURAÇÃO
// ==================================================

const URL_SCRIPT =
    "https://script.google.com/macros/s/AKfycbxe5EG_58E8awnubPjTnr6lKCh8xzuf2PA28Cy2l_UacFyBmrk2KlhM9xt3e1-Tns70/exec";


// ==================================================
// ELEMENTOS
// ==================================================

const canvas =
    document.getElementById("assinatura");

const campoMatricula =
    document.getElementById("matricula");

const campoDocumento =
    document.getElementById("tipoDocumento");

const campoAceite =
    document.getElementById("aceite");

const botaoLimpar =
    document.getElementById("limpar");

const botaoEnviar =
    document.getElementById("enviar");

const campoMensagem =
    document.getElementById("mensagem");


// ==================================================
// SIGNATURE PAD
// ==================================================

const signaturePad =
    new SignaturePad(canvas, {
        minWidth: 1,
        maxWidth: 2.5,
        penColor: "#000000"
    });


// ==================================================
// AJUSTAR CANVAS
// ==================================================

function ajustarCanvas(
    preservarAssinatura = true
) {

    let assinatura = null;

    if (
        preservarAssinatura &&
        !signaturePad.isEmpty()
    ) {

        assinatura =
            signaturePad.toData();

    }


    const ratio =
        Math.max(
            window.devicePixelRatio || 1,
            1
        );


    const largura =
        canvas.offsetWidth;

    const altura =
        canvas.offsetHeight;


    canvas.width =
        largura * ratio;

    canvas.height =
        altura * ratio;


    const contexto =
        canvas.getContext("2d");


    contexto.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );


    if (assinatura) {

        signaturePad.fromData(
            assinatura
        );

    } else {

        signaturePad.clear();

    }

}


ajustarCanvas(false);


// ==================================================
// AJUSTAR CANVAS AO REDIMENSIONAR
// ==================================================

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas(true);

    }
);


// ==================================================
// TOUCH
// ==================================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    function(event) {

        event.preventDefault();

    },
    {
        passive: false
    }
);


// ==================================================
// MENSAGENS
// ==================================================

function mostrarMensagem(
    texto,
    tipo
) {

    campoMensagem.textContent =
        texto;

    campoMensagem.className =
        tipo;

}


function limparMensagem() {

    campoMensagem.textContent =
        "";

    campoMensagem.className =
        "";

}


// ==================================================
// BOTÃO LIMPAR
// ==================================================

botaoLimpar.addEventListener(
    "click",
    function() {

        signaturePad.clear();

        limparMensagem();

    }
);


// ==================================================
// BOTÃO ENVIAR
// ==================================================

botaoEnviar.addEventListener(
    "click",
    async function() {

        limparMensagem();


        // ==========================================
        // PEGAR DADOS
        // ==========================================

        const matricula =
            campoMatricula.value.trim();


        const tipoDocumento =
            campoDocumento.value.trim();


        const aceite =
            campoAceite.checked;


        // ==========================================
        // VALIDAR MATRÍCULA
        // ==========================================

        if (!matricula) {

            mostrarMensagem(
                "⚠️ Informe sua matrícula.",
                "erro"
            );

            campoMatricula.focus();

            return;

        }


        // ==========================================
        // VALIDAR DOCUMENTO
        // ==========================================

        if (!tipoDocumento) {

            mostrarMensagem(
                "⚠️ Selecione o tipo de documento.",
                "erro"
            );

            campoDocumento.focus();

            return;

        }


        // ==========================================
        // VALIDAR ASSINATURA
        // ==========================================

        if (signaturePad.isEmpty()) {

            mostrarMensagem(
                "⚠️ Faça sua assinatura antes de enviar.",
                "erro"
            );

            return;

        }


        // ==========================================
        // VALIDAR ACEITE
        // ==========================================

        if (!aceite) {

            mostrarMensagem(
                "⚠️ Você precisa confirmar a declaração.",
                "erro"
            );

            return;

        }


        // ==========================================
        // CONVERTER ASSINATURA
        // ==========================================

        const assinatura =
            signaturePad.toDataURL(
                "image/png"
            );


        // ==========================================
        // MONTAR DADOS
        // ==========================================

        const dados = {

            matricula:
                matricula,

            tipoDocumento:
                tipoDocumento,

            assinatura:
                assinatura

        };


        // ==========================================
        // CONFERÊNCIA
        // ==========================================

        console.log(
            "Matrícula:",
            matricula
        );

        console.log(
            "Tipo de documento:",
            tipoDocumento
        );


        // ==========================================
        // DESABILITAR BOTÃO
        // ==========================================

        botaoEnviar.disabled =
            true;

        botaoEnviar.textContent =
            "Enviando...";


        // ==========================================
        // ENVIAR PARA GOOGLE APPS SCRIPT
        // ==========================================

        try {

            await fetch(
                URL_SCRIPT,
                {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(dados)
                }
            );


            // ======================================
            // ENVIO REALIZADO
            // ======================================

            mostrarMensagem(
                "✅ Assinatura enviada com sucesso!",
                "sucesso"
            );


            // ======================================
            // LIMPAR FORMULÁRIO
            // ======================================

            campoMatricula.value =
                "";

            campoDocumento.value =
                "";

            campoAceite.checked =
                false;

            signaturePad.clear();


        } catch (erro) {

            console.error(
                "ERRO AO ENVIAR:",
                erro
            );


            mostrarMensagem(
                "❌ Não foi possível enviar a assinatura.",
                "erro"
            );


        } finally {

            botaoEnviar.disabled =
                false;

            botaoEnviar.textContent =
                "Enviar";

        }

    }
);
