let processos = [];

let tempo = document.getElementById("tempo-tabela");

let tempoHTML = `<td style="background-color: transparent;"></td>`;

for (let i = 1; i < 101; i++) {
    tempoHTML += `<th scope="col">${i}</th>`;
}

tempo.innerHTML = tempoHTML;

let ram = document.getElementById("ram");

let ramHTML = ``;

for (let i = 1; i < 11; i++) {
    ramHTML += `<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
}

ram.innerHTML = ramHTML;

let disco = document.getElementById("disco");

let discoHTML = ``;

for (let i = 1; i < 11; i++) {
    discoHTML += `<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
    discoHTML += `<tr><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>`;
}

disco.innerHTML = discoHTML;



let buttonProcesso = document.getElementById("btn-adc-processo");

buttonProcesso.addEventListener("click", (e) => {
    processos.push({time: 0, pages: 0, dead: 0, start: 0});
    realoadProcessos();
});

function realoadProcessos() {
    let listaProcessos = document.getElementById("lista-processos");

    let processosHTML = ``;

    processos.forEach((value, i) => {
        processosHTML += `
            <div class="processo" id="processo ${i}">
                <div class="titulo">
                    <h3>Processo PID ${(i+1).toString().padStart(2, '0')}</h3>
                    <button class="close" onclick="removerProcesso(${i})">
                        <img src="./img/close.png" alt="">
                    </button>
                </div>
                <div class="label">
                    <div class="duracao">
                        <label for="duracao">Duração:</label>
                        <input type="number" name="duracao" id="duracao" value=${value.time}>
                    </div>
                    <div class="pagina">
                        <label for="pagina">Páginas:</label>
                        <input type="number" name="pagina" id="pagina" value=${value.pages}>
                    </div>
                </div>
                <div class="label">
                    <div class="deadline">
                        <label for="deadline">Deadline:</label>
                        <input type="number" name="deadline" id="deadline" value=${value.dead}>
                    </div>
                    <div class="chegada">
                        <label for="chegada">Chegada:</label>
                        <input type="number" name="chegada" id="chegada" value=${value.start}>
                    </div>
                </div>
            </div>
        `
    })

    listaProcessos.innerHTML = processosHTML;
}

function removerProcesso(id) {
    processos = [
        ...processos.slice(0, id),
        ...processos.slice(id + 1),
    ];

    realoadProcessos();
}
