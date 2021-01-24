
let cityList = document.querySelector("#city-list");
let select = document.querySelector("select");
let itemPerPage = 5;
let pageObj = {
    currentPage: null
}


window.onload = listOfCountries;


function getData(countryArr) {
    fetch("/js/data.json")
    .then(res => res.json())
    .then(res => {
        countryArr(res.countries);
    })
}


function listOfCountries() {
    getData(function(countries) {
        countries.forEach((country, index) => {
            let optionElement = createOptionElement(country.country, index); 
            select.appendChild(optionElement);
        })
        
        let selectedCountryIndex = select.value;
        getStateList(selectedCountryIndex);

        select.addEventListener("change", function(e) {
            getStateList(e.target.value);
        })
    })
}


function createOptionElement(country, index) {
    let optionElement = document.createElement("option");
    optionElement.value = index;
    optionElement.innerHTML = country;

    if(country == "Bangladesh") {
        optionElement.setAttribute("selected", "selected");
    }

    return optionElement;
}


function getStateList(index) {
    getData(function(countries) {
        countries.forEach((country, i) => {
            if(i == index) {
                createStatesSection(country.states);
            }
        })
    })
}


function createStatesSection(states) {
    statesListItem(states);
    pagination(states);
}


function statesListItem(states, currentPage = 1) {
    if(Number(currentPage)) {
        let startIndex = (currentPage * itemPerPage) - itemPerPage;
        let endIndex = startIndex + itemPerPage;
        pageObj.currentPage = +currentPage;
    
        cityList.innerHTML = "";
    
        for(let i=startIndex; i<endIndex; i++) {
            if(states[i] != undefined) {
                let city = "<div class='city'>" + states[i] + "</div>";
                cityList.innerHTML += city;
            }
        }
    }else {
        let btnGroup = document.querySelectorAll(".pagination button");

        if(currentPage == "Next") {
            let totalPage = Math.ceil(states.length / itemPerPage);
            
            if(pageObj.currentPage + 1 <= totalPage) {
                pageObj.currentPage += 1;
                statesListItem(states, pageObj.currentPage);

                btnGroup.forEach(btn => {
                    if(btn.innerHTML == pageObj.currentPage) {
                        btn.classList.add("active");
                    }
                })
                
            } else {
                btnGroup.forEach(btn => {
                    if(btn.innerHTML == pageObj.currentPage) {
                        btn.classList.add("active");
                    }
                }) 
            }

        } else if(currentPage == "Prev") {
            if(pageObj.currentPage - 1 >= 1) {
                pageObj.currentPage -= 1;
                statesListItem(states, pageObj.currentPage);

                btnGroup.forEach(btn => {
                    if(btn.innerHTML == pageObj.currentPage) {
                        btn.classList.add("active");
                    }
                })
            } else {
                btnGroup.forEach(btn => {
                    if(btn.innerHTML == pageObj.currentPage) {
                        btn.classList.add("active");
                    }
                }) 
            }
        }
    }
}


function pagination(states) {
    let totalPage = Math.ceil(states.length / itemPerPage);
    paginationButtons(totalPage);

    let pageOneBtn = document.querySelectorAll(".pagination button")[1];
    
    if(Number(pageOneBtn.innerHTML)) {
        pageOneBtn.classList.add("active");
    }
    
    let btnGroup = document.querySelectorAll(".pagination button");

    btnGroup.forEach(btn => {
        btn.addEventListener("click", function() {
            btnGroup.forEach(btn => {
                btn.classList.remove("active");
            })

            if(Number(btn.innerHTML)) {
                btn.classList.add("active");
            }
            
            let page = btn.innerHTML;
            statesListItem(states, page);
        })
    })
}


function paginationButtons(totalPage) {
    let paginationSection = document.querySelector(".pagination");
    paginationSection.innerHTML = "";
    paginationSection.innerHTML += "<button>Prev</button>";
    
    for(let i=1; i<=totalPage; i++) {
        paginationSection.innerHTML += "<button>"+ i +"</button>";
    }

    paginationSection.innerHTML += "<button>Next</button>";
}


// state list json file collected from
// https://gist.github.com/ebaranov/41bf38fdb1a2cb19a781