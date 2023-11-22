class CEP {
    constructor(code, state, city, district, address, status, ok, statusText) {
        this.code = code;
        this.state = state;
        this.city = city;
        this.district = district;
        this.address = address;
        this.status = status;
        this.ok = ok;
        this.statusText = statusText;
        this.cases = null;
    }

    consultaCasos() {
        fetch(`https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/${this.state}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.cases = data.cases;
                this.exibeResultado();
            })
            .catch(error => {
                console.error('Erro na consulta de casos:', error);
                alert('Ocorreu um erro na consulta de casos. Tente novamente.');
                return false;
            });
    }

    exibeResultado() {
        const resultadoDiv = document.getElementById('resultado');

        resultadoDiv.innerHTML = '';

        const codeParagraph = document.createElement('p');
        codeParagraph.innerHTML = `<strong>CEP:</strong> ${this.code}`;

        const cityParagraph = document.createElement('p');
        cityParagraph.innerHTML = `<strong>Cidade:</strong> ${this.city}`;

        const stateParagraph = document.createElement('p');
        stateParagraph.innerHTML = `<strong>Estado:</strong> ${this.state}`;

        const districtParagraph = document.createElement('p');
        districtParagraph.innerHTML = `<strong>Bairro:</strong> ${this.district || 'N/A'}`;

        const addressParagraph = document.createElement('p');
        addressParagraph.innerHTML = `<strong>Endereço:</strong> ${this.address || 'N/A'}`;

        resultadoDiv.appendChild(codeParagraph);
        resultadoDiv.appendChild(cityParagraph);
        resultadoDiv.appendChild(stateParagraph);
        resultadoDiv.appendChild(districtParagraph);
        resultadoDiv.appendChild(addressParagraph);

        if (this.cases !== null) {
            const casesParagraph = document.createElement('p');
            casesParagraph.innerHTML = `<strong>Casos de covid-19 em ${this.state}: </strong> ${this.cases}`;
            resultadoDiv.appendChild(casesParagraph);
        }
    }
}

function consultaCep() {
    const cep = document.getElementById('cep').value;

    fetch(`https://cdn.apicep.com/file/apicep/${cep}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.erro) {
                alert('CEP inválido ou não encontrado. Verifique o CEP digitado.');
            } else {
                const cepObjeto = new CEP(data.code, data.state, data.city, data.district, data.address, data.status, data.ok, data.statusText);
                if (cepObjeto.consultaCasos() == false){
                    cepObjeto.exibeResultado();
                }
            }
        })
        .catch(error => {
            console.error('Erro na consulta de CEP:', error);
            alert('Ocorreu um erro na consulta de CEP. Tente novamente.');
        });
}
