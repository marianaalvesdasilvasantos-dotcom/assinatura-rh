// ==================================================
// CONFIGURAÇÃO
// ==================================================

const URL_SCRIPT =
    "https://script.google.com/macros/s/AKfycbzUEa8JrXHwN-LuE_XuqVS9dP8vyVK-mQFRTHS-JH8RT3iSPlEJci7RftTpIfqCrTN-/exec";


// ==================================================
// ELEMENTOS DA PÁGINA
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


    // Guardar assinatura antes de redimensionar

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


    // Restaurar assinatura

    if (assinatura) {

        signaturePad.fromData(
            assinatura
        );

    } else {

        signaturePad.clear();

    }

}


// Ajuste inicial

ajustarCanvas(false);


// Ajustar novamente quando a tela mudar

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas(true);

    }
);


// ==================================================
// TOUCH NO CELULAR
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
        // PEGAR MATRÍCULA
        // ==========================================

        const matricula =
            campoMatricula.value.trim();


        // ==========================================
        // PEGAR DOCUMENTO
        // ==========================================

        const tipoDocumento =
            campoDocumento.value.trim();


        // ==========================================
        // PEGAR ACEITE
        // ==========================================

        const aceite =
            campoAceite.checked;


        // ==========================================
        // VALIDAÇÃO DA MATRÍCULA
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
        // VALIDAÇÃO DO DOCUMENTO
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
        // VALIDAÇÃO DA ASSINATURA
        // ==========================================

        if (signaturePad.isEmpty()) {

            mostrarMensagem(
                "⚠️ Faça sua assinatura antes de enviar.",
                "erro"
            );

            return;

        }


        // ==========================================
        // VALIDAÇÃO DO ACEITE
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
        // MOSTRAR NO CONSOLE
        // EXATAMENTE O QUE SERÁ ENVIADO
        // ==========================================

        console.log(
            "DADOS ENVIADOS AO GOOGLE APPS SCRIPT:"
        );

        console.log(
            dados
        );

        console.log(
            "Matrícula:",
            dados.matricula
        );

        console.log(
            "Tipo de documento:",
            dados.tipoDocumento
        );


        // ==========================================
        // DESABILITAR BOTÃO DURANTE ENVIO
        // ==========================================

        botaoEnviar.disabled =
            true;

        botaoEnviar.textContent =
            "Enviando...";


        // ==========================================
        // ENVIAR PARA GOOGLE APPS SCRIPT
        // ==========================================

        try {

            const resposta =
                await fetch(
                    URL_SCRIPT,
                    {

                        method: "POST",

                        body:
                            JSON.stringify(dados)

                    }
                );


            // ======================================
            // LER RESPOSTA
            // ======================================

            const resultado =
                await resposta.json();


            console.log(
                "RESPOSTA DO GOOGLE APPS SCRIPT:"
            );

            console.log(
                resultado
            );


            // ======================================
            // SUCESSO
            // ======================================

            if (
                resultado.status === "ok"
            ) {

                mostrarMensagem(
                    "✅ Assinatura enviada com sucesso!",
                    "sucesso"
                );


                // Limpar matrícula

                campoMatricula.value =
                    "";


                // Limpar documento

                campoDocumento.value =
                    "";


                // Desmarcar aceite

                campoAceite.checked =
                    false;


                // Limpar assinatura

                signaturePad.clear();


                console.log(
                    "Documento confirmado pelo servidor:",
                    resultado.documento
                );


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

            console.error(
                "ERRO AO ENVIAR:",
                erro
            );


            mostrarMensagem(

                "❌ Erro ao conectar com o servidor.",

                "erro"

            );


        } finally {

            // ======================================
            // REATIVAR BOTÃO
            // ======================================

            botaoEnviar.disabled =
                false;

            botaoEnviar.textContent =
                "Enviar";

        }

    }
);
