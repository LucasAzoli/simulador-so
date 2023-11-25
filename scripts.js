class Process{
    constructor(Key, ExecutionTime, Deadline, Arrival, pages){
        this.Key = Key
        this.ExecutionTime =  ExecutionTime;
        this.Deadline = Deadline;
        this.Arrival = Arrival;
        this.Finish = 0;
        this.RunningTime = 0;
        this.Executed = false;
        this.Size = pages;
    }

    size() {
        return this.Size;
    }
    
}

class Escalonator{
    constructor(QuantumTime, OverloadTime){
        this.QuantumTime = QuantumTime;
        this.OverloadTime = OverloadTime;
        this.ProcessArray = [];
        this.AverageResponseTime = 0
    }

    AddProcess(Process){
        this.ProcessArray.push(Process);
    }

    FIFO(){
        var Queue = [];
        var RunningProcess  = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var ProcessesByTime = []
        
        var boolean = false
        var FirstProcess = this.ProcessArray[0]
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival < FirstProcess.Arrival){
                FirstProcess = this.ProcessArray[i]
            }
            if(this.ProcessArray[i].Arrival == 0){
                boolean = true
            }
        }

        if(boolean == false){
            let deslocamento = FirstProcess.Arrival
            for(let i = 0; i < this.ProcessArray.length; i++){
                this.ProcessArray[i].Arrival -= deslocamento
            }
        }
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
                if(RunningProcess == undefined){
                    if(this.ProcessArray[i].Arrival == Time){
                        Queue.push(this.ProcessArray[i]);
                    }
                }else{                
                    if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key){
                    Queue.push(this.ProcessArray[i]);}
                }
            }
            /* 
            Caso em que não há ninguém na Queue, e nenhum processo rodando, nesse caso, apenas "avançamos"
            o tempo.
            */
            if(RunningProcess == undefined && Queue.length == 0){
                Time++;
                ProcessesByTime.push("N")
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
                    ProcessesByTime.push("N")
                    Time++;
                    continue;
                }
                RunningProcess = Queue[0];
                Queue.shift();
            }
            ProcessesByTime.push(RunningProcess.Key)
            RunningProcess.RunningTime++;
            Time++;
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        console.log(ProcessesByTime)
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        ProcessesByTime.pop()
        return ProcessesByTime
    }

    SJF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var ProcessesByTime = []
    
        var boolean = false
        var FirstProcess = this.ProcessArray[0]
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival < FirstProcess.Arrival){
                FirstProcess = this.ProcessArray[i]
            }
            if(this.ProcessArray[i].Arrival == 0){
                boolean = true
            }
        }

        if(boolean == false){
            let deslocamento = FirstProcess.Arrival
            for(let i = 0; i < this.ProcessArray.length; i++){
                this.ProcessArray[i].Arrival -= deslocamento
            }
        }

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
        /* 
        Loop em que é executado o SJF em si, onde o RunningProcess guarda o processo
        em execução, "Time" o tempo corrido, com o loop sendo executado até o número
        de processos executados ser igual ao número de processos originais.
        */
       var controle = 0
        while(NumberOfExecutedProcess < NumberOfProcess && controle < 100){
            /* 
            Ao início de cada LOOP, ou seja, quando o "Time" é incrementado, verificamos
            se algum processo entrou na LISTA DE PROCESSOS ESPERANDO, para isso, basta
            verificar se há algum processo com .Arrival
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(RunningProcess == undefined){
                    if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Executed == false){
                        WaitingProcess.push(this.ProcessArray[i]);
                    }
                }else{
                    if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                        WaitingProcess.push(this.ProcessArray[i]);
                    }
                }
            }

            /* 
            Checamos se não há nenhum processo rodando, e nenhum processo aguardando, nesse
            caso, basta incrementar o "Time" até que algum outro processo entre.
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                ProcessesByTime.push("N")
                console.log("N")
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
                console.log("hey:\n")
                console.log(WaitingProcess)
                WaitingProcess.splice(NextProcess,1);
                console.log(WaitingProcess)
            }

            /* 
            Aqui, o Processo rodando terminou, ou seja, seu .RunningTime é igual ao
            .ExecutionTime, nesse caso, o processo que entra no seu lugar é o menor 
            processo daqueles que estão aguardando.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                console.log(`Processo ${RunningProcess.Key} acabou em ${Time-1}\n`)
                
                RunningProcess.Finish = Time;
                RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(WaitingProcess.length == 0){
                    RunningProcess = undefined;
                    ProcessesByTime.push("N")
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
            console.log(`Processo ${RunningProcess.Key} executando\n`)
            ProcessesByTime.push(RunningProcess.Key)
            RunningProcess.RunningTime++;
            Time++;

            controle++
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        console.log(ProcessesByTime)
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        ProcessesByTime.pop()
        return ProcessesByTime
    }

    RR(){
        var Queue = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        var ProcessesByTime = []
    
        var boolean = false
        var FirstProcess = this.ProcessArray[0]
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival < FirstProcess.Arrival){
                FirstProcess = this.ProcessArray[i]
            }
            if(this.ProcessArray[i].Arrival == 0){
                boolean = true
            }
        }

        if(boolean == false){
            let deslocamento = FirstProcess.Arrival
            for(let i = 0; i < this.ProcessArray.length; i++){
                this.ProcessArray[i].Arrival -= deslocamento
            }
        }

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

        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Percorremos a lista de Processos, verificando se há algum que entrou na FILA, perceba que aqui é usado
            o <= ao invés do ==, por conta da adição do tempo de sobrecarga, e para prevenir de pegar processos que já
            foram exectuados, checamos o .Executed também
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(RunningProcess == undefined){
                    if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Executed == false){
                        Queue.push(this.ProcessArray[i]);
                        this.ProcessArray[i].Executed = true;
                    }
                }else{
                    if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                        Queue.push(this.ProcessArray[i]);
                        this.ProcessArray[i].Executed = true;
                    }
                }
            }   
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && Queue.length == 0){
                ProcessesByTime.push("N")
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
                    ProcessesByTime.push("N")
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
                for(let i = 0; i < this.OverloadTime; i++){
                    ProcessesByTime.push("S")
                    Time++;
                }
                RealTimeQuantum = 0;
            }
            ProcessesByTime.push(RunningProcess.Key)
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;
        }
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        console.log(ProcessesByTime)
        ProcessesByTime.pop()
        return ProcessesByTime
    }

    EDF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        var ProcessesByTime = []
    
        var boolean = false
        var FirstProcess = this.ProcessArray[0]
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival < FirstProcess.Arrival){
                FirstProcess = this.ProcessArray[i]
            }
            if(this.ProcessArray[i].Arrival == 0){
                boolean = true
            }
        }

        if(boolean == false){
            let deslocamento = FirstProcess.Arrival
            for(let i = 0; i < this.ProcessArray.length; i++){
                this.ProcessArray[i].Arrival -= deslocamento
            }
        }

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
                if(RunningProcess == undefined){
                    if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Executed == false){
                        WaitingProcess.push(this.ProcessArray[i]);
                        this.ProcessArray[i].Executed = true;
                    }
                }else{
                    if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                        WaitingProcess.push(this.ProcessArray[i]);
                        this.ProcessArray[i].Executed = true;
                    }
                }
            }
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                ProcessesByTime.push("N")
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
                    ProcessesByTime.push("N")
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

                for(let i = 0; i < this.OverloadTime; i++){
                    ProcessesByTime.push("S")
                    //console.log(`Time ${Time}: S`)
                    Time++;
                }
                RealTimeQuantum = 0;
            }
            ProcessesByTime.push(RunningProcess.Key)
            //console.log(`Time ${Time}: ${RunningProcess.Key}`)
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;
        }
        var ART = 0
        console.log(ProcessesByTime)
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        ProcessesByTime.pop()
        return ProcessesByTime
    }

    getAverageResponseTime(){
        return this.AverageResponseTime;
    }
    
}

class Queue {
    constructor() {
      this.items = [];
    }

    enqueue(item) {
      this.items.push(item);
    }

    first() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items.shift();
    }

    front() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.items[0];
    }

    isEmpty() {
      return this.items.length === 0;
    }

    size() {
      return this.items.length;
    }

    // used in LRU algorithm
    remove(item) {
        let index = this.items.indexOf(item);
        if(index > -1) {
            this.items.splice(index, 1);
        }
    }
}



// create a class called Memory


class Memory {
    constructor(algorithm) {
        this.memsize = 50;
        this.memory = new Array(50).fill("-");
        this.algorithm = algorithm; // consider this to be a string ("FIFO" or "LRU")
        this.free = this.memsize; // free space in memory
        this.active = new Queue(); // active processes in memory
        this.LRU = new Queue(); // least recently used processes in memory
        this.virtual = new Array(100).fill("-"); // virtual memory
    }




    // operations with memory (now we're using the PID as the process identifier)
    allocate(process) {
        
        // checking if the process is already in virtual memory (virtual[PID] != "-", significa que temalguma informação ali, ou seja, uma posição da RAM)
       let PID = parseInt(process.Key.split(" ")[1], 10);

        if(this.virtual[PID - 1] != "-") { // 1 is the starting index
            // if it is, check if it is in RAM (então, a gente verifica na RAM se aquela posição apontada está armazenando o processo, ou se a página foi substituída)
            if(this.memory[this.virtual[PID - 1]] == process.Key) {

                // then we do nothing, just update the LRU queue (if we're using LRU)
                if(this.algorithm == "LRU") { // updating the LRU queue
                    this.LRU.remove(process);
                    this.LRU.enqueue(process);
                }
                return;
            }
        }


        // else we free up space in RAM and allocate the process

        // check if there is enough space in the memory to allocate the process

        while(process.size() > this.free) {
          // if there is not enough space, apply the algorithm to free up space and allocate the memory
            if(this.algorithm == "FIFO") {
                let change = this.active.first(); // get the first process in the queue( First in)
                for(let i = 0; i < this.memsize; i++) {
                    if(this.memory[i] == change.Key) { // find the space in memory that the process is occupying
                        this.memory[i] = "-"; // free up the space
                    }
                }
                this.free += change.size(); // update the free space

            }else{
                let change = this.LRU.first(); // get the least recently used process
                for(let i = 0; i < this.memsize; i++) {
                    if(this.memory[i] == change.Key) { // find the space in memory that the process is occupying
                        this.memory[i] = "-"; // free up the space
                    }
                }
                this.free += change.size(); // update the free space
            }
        }


        // if there is enough space, allocate the memory and return the updated memory state
        let aux = 0;

        for(let i = 0; i < this.memsize; i++) {
            if(process.size() == aux){
                this.free -= process.size();
                break;
            }
            if(this.memory[i] == "-") {
                this.memory[i] = process.Key;
                aux++;
            }
        }

        // update the virtual memory with the first occurence of the allocated process

        this.virtual[PID - 1] = this.memory.indexOf(process.Key);

        this.LRU.enqueue(process); // add the process to the queue (LAST USED)
        this.active.enqueue(process); // add the process to the queue
        return;

    }

    getMemoryState() {
        return this.memory;
    }

    getVirtualMemoryState() {
        return this.virtual;
    }

}

let coresHexadecimais = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#B8860B", "#FF4500", "#00FF7F", "#808000", "#800080", "#008080",
    "#C0C0C0", "#808080", "#FFA500", "#A52A2A", "#800000", "#008000",
    "#000080", "#ADD8E6", "#FF69B4", "#DAA520", "#008080", "#800080",
    "#DC143C", "#00FFFF", "#00008B", "#B8860B", "#A9A9A9", "#006400",
    "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000",
    "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1", "#9400D3",
    "#FF4500", "#DA70D6", "#8A2BE2", "#000080", "#D2691E", "#5F9EA0",
    "#FFD700", "#FF6347", "#4B0082", "#7FFF00", "#6495ED", "#FFF8DC",
    "#DCDCDC", "#FFD700", "#00008B", "#008B8B", "#B8860B", "#A9A9A9",
    "#006400", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00", "#9932CC",
    "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1",
    "#9400D3", "#FF4500", "#DA70D6", "#8A2BE2", "#00FF7F", "#D2691E",
    "#5F9EA0", "#FFD700", "#FF6347", "#4B0082", "#7FFF00", "#6495ED",
    "#FFF8DC", "#DCDCDC", "#FFD700", "#00008B", "#008B8B", "#B8860B",
    "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00",
    "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F",
    "#00CED1", "#9400D3", "#008000", "#DA70D6", "#8A2BE2", "#00FF7F",
    "#D2691E", "#5F9EA0", "#FFD700", "#FF6347", "#4B0082", "#7FFF00",
    "#6495ED", "#FFF8DC", "#DCDCDC", "#FFD700", "#00008B", "#008B8B",
    "#800000", "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F"];

let processos = [];

let memory;

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
                        <input type="number" name="duracao" id="duracao ${(i+1).toString().padStart(2, '0')}" value=${value.time} onchange="updateProcessValue(${i})" oninput="this.value|=0">
                    </div>
                    <div class="pagina">
                        <label for="pagina">Páginas:</label>
                        <input type="number" name="pagina" id="pagina ${(i+1).toString().padStart(2, '0')}" value=${value.pages} onchange="updateProcessValue(${i})" oninput="this.value|=0">
                    </div>
                </div>
                <div class="label">
                    <div class="deadline">
                        <label for="deadline">Deadline:</label>
                        <input type="number" name="deadline" id="deadline ${(i+1).toString().padStart(2, '0')}" value=${value.dead} onchange="updateProcessValue(${i})" oninput="this.value|=0">
                    </div>
                    <div class="chegada">
                        <label for="chegada">Chegada:</label>
                        <input type="number" name="chegada" id="chegada ${(i+1).toString().padStart(2, '0')}" value=${value.start} onchange="updateProcessValue(${i})" oninput="this.value|=0">
                    </div>
                </div>
            </div>
        `
    })

    listaProcessos.innerHTML = processosHTML;

    let diagrama = document.getElementById("diagrama");

    diagrama.innerHTML = `<tr id="tempo-tabela"></tr>`;

    let diagramHeader = document.createElement('td');
    diagramHeader.style.backgroundColor = 'transparent';

    let tempo = document.getElementById("tempo-tabela");
    tempo.appendChild(diagramHeader);

    processos.forEach((obj, id) => {
        let processCell = document.createElement('tr');
        let processHTML = `<th class="processo-tempo">PID ${(id+1).toString().padStart(2, '0')}</th>`;
        processCell.innerHTML = processHTML;
        diagrama.appendChild(processCell);
    })
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
    let paginacao = document.getElementById("paginacao").value;
    let quantum = document.getElementById("quantum").value;
    let sobrecarga = document.getElementById("sobrecarga").value;
    var Escalonador = new Escalonator(quantum, sobrecarga)
    let turnAround = document.getElementById("turnaround");
    turnAround.innerHTML = '';

    processos.forEach((value, i) => {
        var process = new Process(`PID ${(i+1).toString().padStart(2, '0')}`, value.time, value.dead, value.start, parseInt(value.pages))

        Escalonador.AddProcess(process)
    })

    let RunningProcessHistory;

    switch (escalonamento) {
        case 'FIFO':
            RunningProcessHistory = Escalonador.FIFO();
            break;
        case 'SJF':
            RunningProcessHistory = Escalonador.SJF();
            break;
        case 'RR':
            RunningProcessHistory = Escalonador.RR();
            break;
        case 'EDF':
            RunningProcessHistory = Escalonador.EDF();
            break;
    }

    switch (paginacao) {
        case 'FIFO':
            memory = new Memory("FIFO");
            break;
        case 'LRU':
            memory = new Memory("LRU");
            break;
    }

    criarDiagrama(RunningProcessHistory, Escalonador.ProcessArray, Escalonador.getAverageResponseTime());
}

function updateProcessValue(id) {
    let time = document.getElementById(`duracao ${(id+1).toString().padStart(2, '0')}`).value;
    let pages = document.getElementById(`pagina ${(id+1).toString().padStart(2, '0')}`).value;
    let dead = document.getElementById(`deadline ${(id+1).toString().padStart(2, '0')}`).value;
    let start = document.getElementById(`chegada ${(id+1).toString().padStart(2, '0')}`).value;
    processos[id] = {time, pages, dead, start}
}

let diagrama = document.getElementById("diagrama");

function criarDiagrama(RunningProcessHistory, process, turnAroundValue) {
    let escalonamento = document.getElementById("escalonamento").value;
    let delay = parseInt(document.getElementById("delay").value);

    diagrama.innerHTML = `<tr id="tempo-tabela"></tr>`;

    let diagramHeader = document.createElement('td');
    diagramHeader.style.backgroundColor = 'transparent';

    let tempo = document.getElementById("tempo-tabela");
    tempo.appendChild(diagramHeader);

    for (let i=0; i<RunningProcessHistory.length; i++) {
        let diagramHeaderTime = document.createElement('th');
        let text = document.createTextNode((i).toString().padStart(3, '0'));

        diagramHeaderTime.appendChild(text);
        setTimeout(() => {
            tempo.appendChild(diagramHeaderTime);
        }, delay*(i+1))
    }

    process.forEach((obj) => {
        let processCell = document.createElement('tr');
        let processHTML = `<th class="processo-tempo">${obj.Key}</th>`;
        processCell.innerHTML = processHTML;
        diagrama.appendChild(processCell);
    })

    RunningProcessHistory.forEach((obj, index) => {
        for (let i=0; i<process.length; i++) {
            let atualProcess;
            let processRow = diagrama.children[i+1];
            let td = document.createElement('td');

            if (process[i].Arrival <= index && process[i].Finish > index) {
                if (obj == "S" &&  RunningProcessHistory[index-1] == process[i].Key) {
                    td.className = "red";
                }else {
                    if (obj == process[i].Key) {
                        td.className = "green";
                        atualProcess = process[i];
                    } else {
                        td.className = "blue";
                    }
                }

                if (((index+1) - process[i].Arrival) > process[i].Deadline && escalonamento == "EDF") {
                    let text = document.createTextNode('✖');
                    td.appendChild(text);
                    td.style.textAlign = "center"; 
                }
            }

            setTimeout(() => {
                processRow.appendChild(td);
                if(atualProcess) {
                    memory.allocate(atualProcess);
                    updateMemory();
                }
            }, delay*(index+1))
        }
    })

    setTimeout(() => {
        let turnAround = document.getElementById("turnaround");
        turnAround.innerHTML = "TurnAround: " + turnAroundValue;
    }, delay*(RunningProcessHistory.length))

}

let disco = document.getElementById("disco");
let discoArray = Array(100).fill('-');
let discoHTML = '';

discoArray.forEach((obj, id) => {
    if (id%10 == 0) {
        discoHTML += `<tr>`;
    }

    discoHTML += `<td>${obj}</td>`;

    if (id%10 == 9) {
        discoHTML += `</tr>`;
    }
})

disco.innerHTML = discoHTML;

let ram = document.getElementById("ram");
let ramArray = Array(50).fill('-');
let ramHTML = '';

ramArray.forEach((obj, id) => {
    if (id%5 == 0) {
        ramHTML += `<tr>`;
    }

    ramHTML += `<td>${obj}</td>`;
    
    if (id%5 == 4) {
        ramHTML += `</tr>`;
    }
})

ram.innerHTML = ramHTML;

function updateMemory() {
    let ram = document.getElementById("ram");
    let ramArray = memory.memory;
    let ramHTML = '';

    let disco = document.getElementById("disco");
    let discoArray = memory.virtual;
    console.log(discoArray)
    let discoHTML = '';

    ramArray.forEach((obj, id) => {
        if (id%5 == 0) {
            ramHTML += `<tr>`;
        }

        if (obj != "-") {
            ramHTML += `<td style="color: ${coresHexadecimais[parseInt(obj.slice(4, obj.length)) - 1]};"><p style="color: #DEF1F9;">${id}</p>${obj.slice(0,3) + `<br>` + obj.slice(4, obj.length)}</td>`;
        } else {
            ramHTML += `<td><p>${id}</p>${obj}</td>`;
        }
        
        if (id%5 == 4) {
            ramHTML += `</tr>`;
        }

    })

    ram.innerHTML = ramHTML;

    discoArray.forEach((obj, id) => {
        if (id%10 == 0) {
            discoHTML += `<tr>`;
        }

        if (obj != "-") {
            discoHTML += `<td style="color: ${coresHexadecimais[id]};">${obj}</td>`;
        } else {
            discoHTML += `<td>${obj}</td>`;
        }
        
        
    
        if (id%10 == 9) {
            discoHTML += `</tr>`;
        }
    })

    disco.innerHTML = discoHTML;
}
