import AbstractView from '../framework/view/abstract-view.js';

const messageTemplate = (messageContent) => `
  <p class="trip-events__msg">${messageContent}</p>
`;

export default class MessageView extends AbstractView{
  #messageContent = null;

  constructor(messageContent){
    super();
    this.#messageContent = messageContent;
  }

  get template(){
    return messageTemplate(this.#messageContent);
  }
}
