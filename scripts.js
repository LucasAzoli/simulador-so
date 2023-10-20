let tempo = document.getElementById("tempo-tabela");

let tempoHTML = `<td style="background-color: transparent;"></td>`;

for (let i = 1; i < 101; i++) {
    tempoHTML += `<th scope="col">${i}</th>`;
}

tempo.innerHTML = tempoHTML;