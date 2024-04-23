"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-06-01T23:36:17.929Z",
    "2023-06-02T10:51:36.790Z",
  ],
  locale: "ru-RU",
  valut: "RUB",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  locale: "en-US",
  valut: "USD",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  locale: "pt-PT",
  valut: "EUR",
};
let thisAcc;
let timerGlobal;
const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Выводит доходы и расходы
function addMonetaryTransactions(acc, sort = false) {
  // Удаляем зачисления которые были написанны в html
  containerMovements.innerHTML = "";
  // sortingArr используется для функции сортировки
  // Там по клику на кнопку либо дублирует массив с деньгами и сортирует, либо просто выводит оригинальный массив
  const sortingArr = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  sortingArr.forEach(function (value, index) {
    // Мультивалюта
    const optionsNum = {
      style: "currency",
      currency: acc.valut,
    };
    let formatNum = Intl.NumberFormat(acc.locale, optionsNum).format(value);
    const time = new Date(acc.movementsDates[index]);
    let colorPrice;
    let texPrice;
    value < 0
      ? ((colorPrice = "withdrawal"), (texPrice = "снятие"))
      : ((colorPrice = "deposit"), (texPrice = "зачисление"));
    containerMovements.insertAdjacentHTML(
      "afterbegin",
      `<div class="movements__row">
      <div class="movements__type movements__type--${colorPrice}">
      ${index + 1} ${texPrice}
      </div>
    <div class="movements__date">${addDate(time)}</div>
    <div class="movements__value">${formatNum}</div>
  </div>`
    );
  });
}
function addDate(time) {
  const day = `${time.getDate()}`.padStart(2, 0);
  const Hours = `${time.getHours()}`.padStart(2, 0);
  const Minutes = `${time.getMinutes()}`.padStart(2, 0);
  const Month = `${time.getMonth() + 1}`.padStart(2, 0);
  const math = Math.round((new Date() - time) / 1000 / 60 / 60 / 24);
  if (math === 0) {
    return "Сегодня";
  } else if (math === 1) {
    return "Вчера";
  } else if (math <= 7) {
    return `${math} дней назад`;
  } else {
    return `${day}/${Month}/${time.getFullYear()}`;
  }
  // return math
}
// addMonetaryTransactions(account1.movements);

// Добавить логин это сокращенные первые первые буквы имени и фамилии
function login(accounts2) {
  accounts2.forEach(function (obj) {
    let namesArr = obj.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((obj) => {
        return obj[0];
      })
      .join("");
    obj.login = namesArr;
  });
}
login(accounts);
// Вывести все зачисления на счет
function showCashDeposit(sumPlus) {
  // приход
  const moreZero = sumPlus
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value);
  // уход
  const minusSum = sumPlus
    .filter((value) => value < 0)
    .reduce((acc, value) => acc + value);
  // Коннект к аккаунту
  const accoun = accounts.find((val) => val.login == thisAcc);
  // Форматирование по стране
  const optionsNum = {
    style: "currency",
    currency: accoun.valut,
  };
  const formatMoreZero = Intl.NumberFormat(accoun.locale, optionsNum).format(
    moreZero
  );
  const formatMinusSum = Intl.NumberFormat(accoun.locale, optionsNum).format(
    minusSum
  );
  // DOM вывод

  labelSumIn.textContent = formatMoreZero;
  labelSumOut.textContent = formatMinusSum;
  labelSumInterest.textContent = Intl.NumberFormat(
    accoun.locale,
    optionsNum
  ).format(moreZero + minusSum);
  labelBalance.textContent = Intl.NumberFormat(
    accoun.locale,
    optionsNum
  ).format(moreZero + minusSum);
}
// showCashDeposit(account1.movements);
// Сюда записывается авторизированный аккаунт

function timeout() {
  let time = 600;
  function tick() {
    // Минуты
    const minut = String(Math.trunc(time / 60)).padStart(2, 0);
    // Секунды
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minut}:${second}`;
    console.log(time);
    time--;
    if (time < 0) {
      clearInterval(clock);
      containerApp.style.opacity = "0";
    }
  }
  tick();
  const clock = setInterval(tick, 1000);
  return clock;
}

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  if (timerGlobal) {
    clearInterval(timerGlobal);
  }
  timerGlobal = timeout();
  /* Массив accounts ссылается на обьекты, acc.login на методы логин
   inputLoginUsername.value на поле ввода логина
   find перебирает все значения массива accounts а это обьекты
   если условие true возвращиет ПЕРВОЕ ИСТИННОЕ ЗНАЧЕНИЕ
   account присвоен обьект у котороко метод login совпадает с введенным значением в поле ввода*/
  const account = accounts.find(
    (acc) => acc.login === inputLoginUsername.value
  );
  /* проверка account.pin (метод с пинкодом в обьекте), срвпадает ли он с полем pin
   if(account) проверка на существование аккаунта*/
  if (account && account.pin === +inputLoginPin.value) {
    containerApp.style.opacity = "1";
    /* console.log(account);
     эти функции обьявленны выше
     account подставляет вместо себя нужный аккаунт*/

    thisAcc = inputLoginUsername.value;
    showCashDeposit(account.movements);
    addMonetaryTransactions(account);
    inputLoginPin.value = "";
    inputLoginUsername.value = "";
  }
});
// перевод средств
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(timerGlobal);
  timerGlobal = timeout();
  /* тут идет перебор accounts в  value подставляются обьекты
   value.login обращаемся к полю логин и сравниваем его с полем ввода*/
  //  определяет аккаунт по введенному полю ввода
  const resiveAccount = accounts.find(function (value) {
    return value.login == inputTransferTo.value;
  });
  // получяю сколько средств на счету для понимания на каком я сейчас аккаунте
  let arr = labelBalance.textContent + "";
  arr = arr.split(" ");
  // Определяю на каком я аккаунте
  const numPerevood = account();
  // Тут сумма всех финансовых операций
  const sum = numPerevood.movements.reduce((acc, num) => acc + num);

  // Проверка на привильность введеных данных
  if (
    inputTransferTo &&
    resiveAccount &&
    inputTransferAmount.value != 0 &&
    inputTransferTo.value != 0 &&
    // Проверка на то что на счету хватает денег
    sum >= inputTransferAmount.value
  ) {
    // Авторизированному аккаунту дабвляется введеная сумма в отрицательном значении
    numPerevood.movements.push(inputTransferAmount.value * -1);
    // Перевод сретств на написанный аккаунт
    resiveAccount.movements.push(+inputTransferAmount.value);
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    // Сумма финансовых операций
  } else if (!resiveAccount) {
    alert("Такого аккаунта не существует");
    inputTransferTo.value = "";
  } else if (sum < inputTransferAmount.value) {
    alert("На счету недостаточно средств");
    inputTransferAmount.value = "";
  } else if (inputTransferAmount.value == 0) {
    alert("Введите сумму");
  }
  const acc = accounts.find((value) => value.login == thisAcc);
  acc.movementsDates.push(new Date());
  resiveAccount.movementsDates.push(new Date());
  showCashDeposit(numPerevood.movements);
  addMonetaryTransactions(numPerevood);

  console.log(resiveAccount);
});

// Удаление аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const ase = accounts.findIndex(
    (index) => index.login == inputCloseUsername.value
  );
  console.log(ase);
  if (
    accounts[ase].login == thisAcc &&
    accounts[ase].pin == +inputClosePin.value
  ) {
    containerApp.style = "opacity: 0";
    accounts.splice(ase, 1);
  }
  console.log(accounts);
  inputClosePin.value = "";
  inputCloseUsername.value = "";
});

// Пополнить счет
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(timerGlobal);
  timerGlobal = timeout();
  const Acc = account();
  if (inputLoanAmount.value && inputLoanAmount.value > 0) {
    Acc.movements.push(+inputLoanAmount.value);
    Acc.movementsDates.push(new Date());
    showCashDeposit(Acc.movements);
    addMonetaryTransactions(Acc);
  }
  inputLoanAmount.value = "";
});
// Сумма всех балансов
const sumBalans = accounts
  .map((deposit) => deposit.movements)
  .flat()
  .reduce((acc, num) => acc + num);
console.log(sumBalans);

// Сортировка
// Эта функция связанна с addMonetaryTransactions там был добавлен sortingArr
// По клику на кнопку либо дублирует массив с деньгами и сортирует, либо просто выводит оригинальный массив
let sorting = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  const accauntLogin = account();
  if (thisAcc == accauntLogin.login) {
    showCashDeposit(accauntLogin.movements);
    addMonetaryTransactions(accauntLogin, !sorting);
    sorting = !sorting;
  }
});
// Проверка по логину на каком я аккаунте
// Используется в других функциях
function account() {
  const accaunt = accounts.find((value) => value.login == thisAcc);
  return accaunt;
}
labelBalance.addEventListener("click", function () {
  Array.from(document.querySelectorAll(".movements__value"), function (val, i) {
    return (val.textContent = val.textContent.replace("₽", " RUB"));
  });
});

// Дата под текущим балансом

const options = {
  // long, short, numeric
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

const formatDate = Intl.DateTimeFormat(navigator.language, options).format(
  new Date()
);
labelDate.textContent = formatDate;

// 300 секунд илл 5 минут
let vrema = 300;
// Эта функция выпалняет какое-то действие каждые 1000 миллисекунд или 1 секунду
setInterval(function () {
  // Тут все время делим на 60 и получаем минуты
  // Отбрасываем остаток от деления так как vrema каждый раз уменьшается
  // Преобразуем в строку и добавляем перед чмслом 0
  const min = String(Math.trunc(vrema / 60)).padStart(2, 0);
  // Получаем остаток от деления
  const sec = String(vrema % 60).padStart(2, 0);
  console.log(min, " ", sec);
  vrema--;
}, 1000);
