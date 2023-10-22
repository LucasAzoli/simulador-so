class Process{
    constructor(Key, ExecutionTime, Deadline, Arrival){
        this.Key = Key
        this.ExecutionTime =  ExecutionTime;
        this.Deadline = Deadline;
        this.Arrival = Arrival;
        this.Finish = 0;
        this.RunningTime = 0;
        this.Executed = false
    }
    
}

class Escalonator{
    constructor(QuantumTime, OverloadTime){
        this.QuantumTime = QuantumTime;
        this.OverloadTime = OverloadTime;
        this.ProcessArray = [];
        this.RunningProcessHistory = [];
    }

    AddProcess(Process){
        this.ProcessArray.push(Process);
    }

    AddProcessHistory(Process){
        this.RunningProcessHistory.push(Process);
    }

    clearProcessHistory() {
        this.RunningProcessHistory = [];
    }

    FIFO(){
        var Queue = [];
        var RunningProcess  = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        this.clearProcessHistory();
        
        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime){
                RunningProcess = this.ProcessArray[i];
                break;
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }
        this.AddProcessHistory(RunningProcess)
        
        /*
        Loop em que é implementado o Fifo em si.
        RunningProcess armazena o processo em execução, e Time o tempo que já se passou.
        O loop acaba quando o número de processos executado é o mesmo do número de processos
        para serem executados.
        */
        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Ao início de cada iteração (ou seja, quando o Time aumenta), percorremos o vetor de Processos,
            checando se algum processo entrou na Queue, ou seja, se há algum processo com .Arrival ==  Time.
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key){
                    Queue.push(this.ProcessArray[i]);
                }
            }
            /* 
            Caso em que não há ninguém na Queue, e nenhum processo rodando, nesse caso, apenas "avançamos"
            o tempo.
            */
            if(RunningProcess == undefined && Queue.length == 0){
                Time++;
                continue;
            }
            /* 
            Caso em que não havia nenhum processo rodando, e algum processo novou (ou alguns) entraram na
            fila, nesse caso o primeiro a entrar passa a ser o processo corrente, com o mesmo saindo da 
            Queue
            */
            if(RunningProcess == undefined && Queue.length > 0){
                RunningProcess = Queue[0];
                Queue.shift()
            }
            /* 
            Verifica se o RunningProcess já atingiu o tempo rodando igual ao seu tempo de execução
            definido na sua criação, ou seja, se o processo já terminou. Nesse caso, atribuímos seu tempo
            de finalização como o "Time" atual, e aumentamos o número de processos que já foram executados.

            Após isso, trocamos o processo "correndo" pelo primeiro processo da fila.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                RunningProcess.Finish = Time;
                RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(Queue.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                RunningProcess = Queue[0];
                Queue.shift();
            }
            RunningProcess.RunningTime++;
            Time++;
            this.AddProcessHistory(RunningProcess)
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        var AverageResponseTime = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            AverageResponseTime += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        AverageResponseTime = AverageResponseTime / NumberOfProcess
        return AverageResponseTime.toFixed(2)
    }

    SJF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        this.clearProcessHistory();

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime > 0){
                if(RunningProcess == undefined){
                    RunningProcess = this.ProcessArray[i];
                }else{
                    if(RunningProcess.ExecutionTime > this.ProcessArray[i].ExecutionTime){
                        RunningProcess = this.ProcessArray[i]
                    }
                }
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }
        this.AddProcessHistory(RunningProcess)
        /* 
        Loop em que é executado o SJF em si, onde o RunningProcess guarda o processo
        em execução, "Time" o tempo corrido, com o loop sendo executado até o número
        de processos executados ser igual ao número de processos originais.
        */
        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Ao início de cada LOOP, ou seja, quando o "Time" é incrementado, verificamos
            se algum processo entrou na LISTA DE PROCESSOS ESPERANDO, para isso, basta
            verificar se há algum processo com .Arrival
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key){
                    WaitingProcess.push(this.ProcessArray[i]);
                }
            }

            /* 
            Checamos se não há nenhum processo rodando, e nenhum processo aguardando, nesse
            caso, basta incrementar o "Time" até que algum outro processo entre.
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                Time++;
                continue;
            }

            /* 
            Nesse caso, não havia nenhum processo rodando, e um, ou mais, processos entraram 
            na fila, com o processo de menor tempo de execução passando a rodar.
            */
            if(RunningProcess == undefined && WaitingProcess.length > 0){
                var LessTime = WaitingProcess[0].ExecutionTime
                var NextProcess = 0
                for(var k = 0; k < WaitingProcess.length; k++){
                    if(WaitingProcess[k].ExecutionTime < LessTime){
                        NextProcess = k;
                    }
                }
                RunningProcess = WaitingProcess[NextProcess];
                WaitingProcess.slice(NextProcess,1);
            }

            /* 
            Aqui, o Processo rodando terminou, ou seja, seu .RunningTime é igual ao
            .ExecutionTime, nesse caso, o processo que entra no seu lugar é o menor 
            processo daqueles que estão aguardando.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                //console.log(`Processo ${RunningProcess.Key} acabou\n`)
                RunningProcess.Finish = Time;
                RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(WaitingProcess.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                var LessTime = WaitingProcess[0].ExecutionTime
                var NextProcess = 0
                for(var k = 0; k < WaitingProcess.length; k++){
                    if(WaitingProcess[k].ExecutionTime < LessTime){
                        NextProcess = k;
                    }
                }
                RunningProcess = WaitingProcess[NextProcess];
                WaitingProcess.splice(NextProcess,1);
            }
            RunningProcess.RunningTime++;
            Time++;
            this.AddProcessHistory(RunningProcess)
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        var AverageResponseTime = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            AverageResponseTime += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        AverageResponseTime = AverageResponseTime / NumberOfProcess
        return AverageResponseTime.toFixed(2)
    }

    RR(){
        var Queue = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        this.clearProcessHistory();

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.

        Além disso, alteramos o atributo .Executed, para indicar que o processo já começou a ser
        executado.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime){
                RunningProcess = this.ProcessArray[i];
                RunningProcess.Executed = true
                break;
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }
        this.AddProcessHistory(RunningProcess)

        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Percorremos a lista de Processos, verificando se há algum que entrou na FILA, perceba que aqui é usado
            o <= ao invés do ==, por conta da adição do tempo de sobrecarga, e para prevenir de pegar processos que já
            foram exectuados, checamos o .Executed também
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                    Queue.push(this.ProcessArray[i]);
                    this.ProcessArray[i].Executed = true;
                }
            }   
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && Queue.length == 0){
                Time++;
                continue;
            }
            /*
             Não há nenhum processo rodando, mas algum entra na FILA, com esse passando a ser executado, e o Quantum
             zerado.
             */
            if(RunningProcess == undefined && Queue.length > 0){
                RunningProcess = Queue[0];
                Queue.shift();
                RealTimeQuantum = 0;
            }
            /* 
            Processo que estava executando terminou, assim, zeramos o Quantum, e o que estava na FILA entra em seu lugar.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                //console.log(`${RunningProcess.Key} terminou`)
                RealTimeQuantum = 0;
                RunningProcess.Finish = Time;
                //RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(Queue.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                RunningProcess = Queue[0];
                Queue.shift();
            }
            /* 
            Quantum chegou ao seu limite, o processo que estava sendo executado volta para FILA, e o que estava na
            frente passa a ser executado, e o "Time" é incrementado pelo tempo de sobrecarga.
            */
            if(RealTimeQuantum == this.QuantumTime){
                var AuxVar = RunningProcess;
                //console.log("Início")
                Queue.push(AuxVar);
                //console.log(`${AuxVar.Key} voltou pra fila`)
                RunningProcess = Queue[0];
                Queue.shift();
                Time += this.OverloadTime;
                RealTimeQuantum = 0;
            }
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;
            this.AddProcessHistory(RunningProcess)
        }
        var AverageResponseTime = 0

        for(let i = 0; i < this.ProcessArray.length; i++){
            AverageResponseTime += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        AverageResponseTime = AverageResponseTime / NumberOfProcess
        return AverageResponseTime.toFixed(2)
    }

    EDF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        this.clearProcessHistory();

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.

        Além disso, alteramos o atributo .Executed, para indicar que o processo já começou a ser
        executado.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime > 0){
                if(RunningProcess == undefined){
                    RunningProcess = this.ProcessArray[i];
                }else{
                    if(RunningProcess.Deadline > this.ProcessArray[i].Deadline){
                        RunningProcess = this.ProcessArray[i]
                    }
                }
            }
        }
        this.AddProcessHistory(RunningProcess)

        if(RunningProcess == undefined){
            return 0;
        }
        RunningProcess.Executed = true

        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Percorremos a lista de Processos, verificando se há algum que entrou na FILA, perceba que aqui é usado
            o <= ao invés do ==, por conta da adição do tempo de sobrecarga, e para prevenir de pegar processos que já
            foram exectuados, checamos o .Executed também
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                    WaitingProcess.push(this.ProcessArray[i]);
                    this.ProcessArray[i].Executed = true;
                }
            }
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                Time++;
                continue;
            }
            /* 
            Não havia nenhum processo rodando, mas um, ou mais, entram na lista de espera, entrando aquele com o menor
            Deadline.
            */
            if(RunningProcess == undefined && WaitingProcess.length > 0){
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }                 
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);
                RealTimeQuantum = 0;
            }
            /* 
            Processo que estava sendo executado termina, entrando aquele com o menor deadline naquele momento.
            Esse cálculo é feito diminuindo o DEADLINE do tempo em que o processo começou a executar, ou seja, 
            de "Time" menos o tempo de chegada
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                RealTimeQuantum = 0;
                RunningProcess.Finish = Time;
                NumberOfExecutedProcess++;
                if(WaitingProcess.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }         
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);
                RealTimeQuantum = 0;
            }
            /* 
            Quantum terminou, o processo com o menor DEADLINE entra, e o "Time" é incrementado com o
            valor do tempo de sobrecarga.
            */
            if(RealTimeQuantum == this.QuantumTime){
                var AuxVar = RunningProcess;
                WaitingProcess.push(AuxVar);
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }             
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);
                Time += this.OverloadTime;
                RealTimeQuantum = 0;
            }
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;

            this.AddProcessHistory(RunningProcess)
        }
        var AverageResponseTime = 0

        for(let i = 0; i < this.ProcessArray.length; i++){
            AverageResponseTime += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        AverageResponseTime = AverageResponseTime / NumberOfProcess
        return AverageResponseTime.toFixed(2)
    }
    
}

let processos = [];

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
                        <input type="number" name="duracao" id="duracao ${(i+1).toString().padStart(2, '0')}" value=${value.time}>
                    </div>
                    <div class="pagina">
                        <label for="pagina">Páginas:</label>
                        <input type="number" name="pagina" id="pagina ${(i+1).toString().padStart(2, '0')}" value=${value.pages}>
                    </div>
                </div>
                <div class="label">
                    <div class="deadline">
                        <label for="deadline">Deadline:</label>
                        <input type="number" name="deadline" id="deadline ${(i+1).toString().padStart(2, '0')}" value=${value.dead}>
                    </div>
                    <div class="chegada">
                        <label for="chegada">Chegada:</label>
                        <input type="number" name="chegada" id="chegada ${(i+1).toString().padStart(2, '0')}" value=${value.start}>
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

function simular() {
    let escalonamento = document.getElementById("escalonamento").value;
    let quantum = document.getElementById("quantum").value;
    let sobrecarga = document.getElementById("sobrecarga").value;
    var Escalonador = new Escalonator(quantum, sobrecarga)

    updateProcessValue();

    processos.forEach((value, i) => {
        var process = new Process(`PID ${(i+1).toString().padStart(2, '0')}`, value.time, value.dead, value.start)

        Escalonador.AddProcess(process)
    })

    switch (escalonamento) {
        case 'FIFO':
            Escalonador.FIFO();
            break;
        case 'SJF':
            Escalonador.SJF();
            break;
        case 'RR':
            Escalonador.RR();
            break;
        case 'EDF':
            Escalonador.EDF();
            break;
    }
      
    

    criarDiagrama(Escalonador.RunningProcessHistory, Escalonador.ProcessArray);
}

function updateProcessValue() {
    processos.forEach((value, i) => {
        let time = document.getElementById(`duracao ${(i+1).toString().padStart(2, '0')}`).value;
        let pages = document.getElementById(`pagina ${(i+1).toString().padStart(2, '0')}`).value;
        let dead = document.getElementById(`deadline ${(i+1).toString().padStart(2, '0')}`).value;
        let start = document.getElementById(`chegada ${(i+1).toString().padStart(2, '0')}`).value;
        
        processos[i] = {time, pages, dead, start}
    })
}

let diagrama = document.getElementById("diagrama");

function criarDiagrama(RunningProcessHistory, process) {
    let delay = parseInt(document.getElementById("delay").value);

    diagrama.innerHTML = `<tr id="tempo-tabela"></tr>`;

    let diagramHeader = document.createElement('td');
    diagramHeader.style.backgroundColor = 'transparent';

    let tempo = document.getElementById("tempo-tabela");
    tempo.appendChild(diagramHeader);

    for (let i=1; i<RunningProcessHistory.length +1; i++) {
        let diagramHeaderTime = document.createElement('th');
        var text = document.createTextNode((i).toString().padStart(3, '0'));

        diagramHeaderTime.appendChild(text);
        setTimeout(() => {
            tempo.appendChild(diagramHeaderTime);
        }, delay*i)
    }

    process.forEach((obj) => {
        let processCell = document.createElement('tr');
        let processHTML = `<th class="processo-tempo">${obj.Key}</th>`;
        processCell.innerHTML = processHTML;
        diagrama.appendChild(processCell);
    })

    RunningProcessHistory.forEach((obj, index) => {
        for (let i=0; i<process.length; i++) {
            let processRow = diagrama.children[i+1];
            let td = document.createElement('td');

            if (process[i].Arrival <= index && process[i].Finish > index) {
                if (obj == process[i]) {
                    td.className = "green";
                } else {
                    td.className = "blue";
                }
            }

            setTimeout(() => {
                processRow.appendChild(td);
            }, delay*(index+1))
        }
    })
}