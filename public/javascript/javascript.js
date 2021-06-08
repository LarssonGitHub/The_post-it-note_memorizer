const eventDeligationContainerMain = document.getElementById('eventDeligationContainerMain');
const postItNoteContainer = document.getElementById('postItNoteContainer');
const eventDeligationHeader = document.getElementById('eventDeligationHeader')
const notificationContainer = document.getElementById('notificationContainer');
const postForm = document.getElementById('postForm');
const closeNotificationEvent = document.getElementById('closeNotification');
const postFormContainer = document.getElementById('postFormContainer');

//header events..
function validatePostFormContainerVisiblity() {
  let isPostFormNone = window.getComputedStyle(postFormContainer, null).getPropertyValue('display');
  if (isPostFormNone === 'none') {
    postFormContainer.style.display = "block";
    return;
  }
  postFormContainer.style.display = "none";
}

function callNuke() {
  let doit = confirm("Are you sure you want to nuke everything?")
  if (!doit) {
    return;
  }
  let really = confirm("YOU CAN NOT REGRET THIS!!")
  if (!really) {
    console.log('phew...');
    return;
  }
  //put effects and bomb here if you have time..!

  fetch('/nuke/database', {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      location.reload();
    }).catch((err) => {
      console.log(err);
      let notificationTextNode = 'Something failed with fetch nuke.. Sorry'
      alterNotificationContent(notificationTextNode)
    });
}


function validateHeaderEvent(event) {
  let eventTargetRef = event.target;
  if (eventTargetRef.matches('#postItStackEvent')) {
    validatePostFormContainerVisiblity()
    return;
  }
  if (eventTargetRef.matches('#postFormContainer') || eventTargetRef.matches('#closePostForm')) {
    validatePostFormContainerVisiblity()
    return;
  }
  if (eventTargetRef.matches('#nukeDatabase')) {
    callNuke()
    return;
  }
}

eventDeligationHeader.addEventListener('click', (event) => {
  validateHeaderEvent(event)
})


{
  /* <div
  class="containerChild postIt p-5 mb-5  p-2 col-12 col-md-6 col-lg-4 col-xl-2 col-xxl-2">
  <button class="btn btn-primary btnVisiblity displayHide displayShow editBtn">Edit note</button>
  <h2 class="headline" contenteditable="false"></h2>
  <p class="bodyText" contenteditable="false"></p>
  <select class="colorSelect btnVisiblity displayHide" id="colorSelect" name="colorSelect">
    <option value="Green">Green</option>
    <option value="Blue">Blue</option>
    <option value="Red">Red</option>
    <option value="Yellow">Yellow</option>
    <option value="Orange">Orange</option>
    <option value="Purple">Purple</option>
  </select>
  <p class="userID" hidden></p>
  <button class="btn btn-primary btnVisiblity displayHide displayShow deleteBtn"></button>
  </div> */
}

function createFetchedChildContainer(fetchChildContainerValues) {
  console.log("YO, it worked, append", fetchChildContainerValues);
  let {
    _id,
    headline,
    bodyText,
    colorSelect,
    userID
  } = fetchChildContainerValues;
  console.log(fetchChildContainerValues);


  const newChildContainerDiv = document.createElement("div");
  newChildContainerDiv.id = _id;
  newChildContainerDiv.classList += `postItColor${colorSelect} containerChild postIt p-5 mb-5 col-12 col-md-6 col-lg-4 col-xl-2 col-xxl-2 align-self-start`;

  newChildContainerDiv.innerHTML += `  
  <button class="btn btn-primary btnVisiblity displayHide displayShow editBtn">Edit note</button>
  <h2 class="headline" contenteditable="false">${headline}</h2>
  <p class="bodyText" contenteditable="false">${bodyText}</p>
  <select class="colorSelect btnVisiblity displayHide" id="colorSelect" name="colorSelect">
    <option value="Green">Green</option>
    <option value="Blue">Blue</option>
    <option value="Red">Red</option>
    <option value="Yellow">Yellow</option>
    <option value="Purple">Purple</option>
    <option value="Orange">Orange</option>
  </select>
  <p class="userID" hidden>${userID}</p>
  <button class="btn btn-primary btnVisiblity displayHide displayShow deleteBtn"></button>
  `

  postItNoteContainer.append(newChildContainerDiv);
}

function checkNotificationVisiblity(isClient) {
  let isDisplayNone = window.getComputedStyle(notificationContainer, null).getPropertyValue('display');
  if (isClient) {
    notificationContainer.style.display = 'none';
    return;
  }

  if (isDisplayNone === 'none') {
    notificationContainer.style.display = "block";
    return;
  }
}


function removeElementAfterFetch(childContainerID) {
  let removeFromTree = document.getElementById(childContainerID);
  removeFromTree.remove();
}

function alterNotificationContent(notificationTextNode) {
  let notificationPara = document.getElementById("notificationPara");
  notificationPara.textContent = notificationTextNode;
}

function childContainerElementValues(childContainer) {
  let dataBaseId = childContainer.id;
  let headline = childContainer.querySelector(".headline").textContent;
  let BodyText = childContainer.querySelector(".bodyText").textContent;
  let colorSelect = childContainer.querySelector(".colorSelect").value;
  let userID = childContainer.querySelector(".userID").textContent;
  return {
    id: dataBaseId,
    headlineValue: headline,
    bodyTextValue: BodyText,
    colorSelectValue: colorSelect,
    userIDValue: userID
  }
}

function childContainerElements(childContainer) {
  let headline = childContainer.querySelector(".headline");
  let bodyText = childContainer.querySelector(".bodyText");
  let colorSelect = childContainer.querySelector(".colorSelect");
  let userID = childContainer.querySelector(".userID");
  return {
    headline: headline,
    bodyText: bodyText,
    colorSelect: colorSelect,
    userID: userID
  }
}

function makeElementsEditable(childContainer) {
  let {
    headline,
    bodyText,
    colorSelect,
  } = childContainerElements(childContainer);

  let headlineAttribute = headline.getAttribute('contenteditable');
  let bodyTextAttribute = bodyText.getAttribute('contenteditable');

  if (headlineAttribute === 'false' && bodyTextAttribute === 'false') {
    headline.contentEditable = 'true';
    bodyText.contentEditable = 'true';
    return;
  }
  if (headlineAttribute === 'true' && bodyTextAttribute === 'true') {
    headline.contentEditable = 'false';
    bodyText.contentEditable = 'false';
  }
}

function staticBtnsVisiblity() {
  let allstaticBtns = eventDeligationContainerMain.querySelectorAll(".btnVisiblity");

  //Used in conjuction with css, less javascript code, displayShow = visible, displayHide = none;
  allstaticBtns.forEach(btn => {
    if (!btn.classList.contains('displayShow')) {
      btn.classList.add('displayShow')
      return
    }
    if (btn.classList.contains('displayShow')) {
      btn.classList.remove('displayShow')
    }
  });
}

function createNodeBtn(idName) {
  const createBtn = document.createElement('BUTTON');
  createBtn.id = idName;
  createBtn.classList += 'btn btn-primary';
  return createBtn;
}

function addDynamicBtns(childContainer) {
  const backBtn = createNodeBtn('abortEditBtn');
  const saveBtn = createNodeBtn('saveEditsBtn');
  childContainer.insertBefore(backBtn, childContainer.firstChild)
  childContainer.insertBefore(saveBtn, childContainer.firstChild)
}

function removeDynamicBtns(childContainer) {
  const grabBackBtn = childContainer.querySelector("#abortEditBtn")
  const grabSaveBtn = childContainer.querySelector("#saveEditsBtn")
  childContainer.removeChild(grabSaveBtn);
  childContainer.removeChild(grabBackBtn);
}

//Fetch methods...

function fetchDelete(childContainer) {

  let allChildContainerValues = childContainerElementValues(childContainer)
  let ChildContainerID = allChildContainerValues.id;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  fetch('/delete/' + ChildContainerID, options)
    .then(response => response.json())
    .then(data => {
      let notificationTextNode = data.message;
      alterNotificationContent(notificationTextNode)
      checkNotificationVisiblity(false)
      let childContainerID = data.document
      removeElementAfterFetch(childContainerID)
    }).catch((err) => {
      console.log(err);
      let notificationTextNode = 'Something failed with fetch delete... My fault'
      alterNotificationContent(notificationTextNode)
    });
}

function callPutFetch(childContainer) {

  let allChildContainerValues = childContainerElementValues(childContainer)
  let ChildContainerID = allChildContainerValues.id;

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(allChildContainerValues)
  };
  fetch('/put/' + ChildContainerID, options)
    .then(resp => resp.json())
    .then(data => {
      console.log(data.document._id);
      let notificationTextNode = data.message;
      alterNotificationContent(notificationTextNode)
      checkNotificationVisiblity(false)
      let childContainerID = data.document._id;
      removeElementAfterFetch(childContainerID)
      let fetchChildContainerValues = data.document;
      createFetchedChildContainer(fetchChildContainerValues)
    }).catch(err => {
      console.log(err);
      let notificationTextNode = 'Something failed with fetch put... My fault'
      alterNotificationContent(notificationTextNode)
    });
}

postForm.addEventListener("submit", e => {
  validatePostFormContainerVisiblity()
  e.preventDefault()

  const formDataValues = new FormData(e.target);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formDataValues))
  };
  fetch('/post/', options)
    .then(resp => resp.json())
    .then(data => {
      
      let notificationTextNode = data.message;
      alterNotificationContent(notificationTextNode)
      checkNotificationVisiblity(false)

      let fetchChildContainerValues = data.document;
      createFetchedChildContainer(fetchChildContainerValues)

    }).catch(err => {
      console.log(err);
      let notificationTextNode = 'Something failed with fetch post... My fault'
      alterNotificationContent(notificationTextNode)
    });
})

function deleteEvent(childContainer) {
  let {
    headlineValue
  } = childContainerElementValues(childContainer)

  let willDelete = confirm('Are you sure you want to delete ' + headlineValue + "?")

  if (willDelete) {
    fetchDelete(childContainer)
    return;
  }
  console.log("Alright, good you didn't :D");
}


function saveEdits(childContainer) {
  let willSaveEdits = confirm("You want to save this post it note?");
  if (willSaveEdits) {
    callPutFetch(childContainer)
    removeDynamicBtns(childContainer)
    staticBtnsVisiblity()
    makeElementsEditable(childContainer)
  }
}

function abortEditedContainer(childContainer) {
  let cancel = confirm("are you sure you want to leave? Your note won't be saved")
  if (cancel) {
    removeDynamicBtns(childContainer)
    staticBtnsVisiblity()
    makeElementsEditable(childContainer)
  }
}



function editEvent(childContainer) {
  makeElementsEditable(childContainer)
  staticBtnsVisiblity()
  addDynamicBtns(childContainer)
}


function validatEventAction(event, childContainer) {
  let eventTargetActionRef = event.target;
  if (eventTargetActionRef.matches('.editBtn')) {
    editEvent(childContainer)
    return;
  }
  if (eventTargetActionRef.matches('.deleteBtn')) {
    deleteEvent(childContainer)
    return;
  }
  if (eventTargetActionRef.matches('#saveEditsBtn')) {
    saveEdits(childContainer)
    return;
  }
  if (eventTargetActionRef.matches('#abortEditBtn')) {
    abortEditedContainer(childContainer)
    return;
  }
}


function grabChild(event) {
  let eventTargetRef = event.target;
  if (eventTargetRef.matches('#eventDeligationContainerMain')) {
    return;
  }
  if (!eventTargetRef.matches('.containerChild')) {
    eventTargetRef = eventTargetRef.parentNode;
  }
  return eventTargetRef;
}

function grabContainerChild(event) {
  let childContainer = grabChild(event)
  if (!childContainer || "") {
    return;
  }
  validatEventAction(event, childContainer)
}


eventDeligationContainerMain.addEventListener('click', (event) => {
  grabContainerChild(event);
})


closeNotificationEvent.addEventListener('click', () => {
  checkNotificationVisiblity(true)
})