export default class CardAssist{
    private static _instance: CardAssist = null;
    public static getInstance(): CardAssist {
        if (CardAssist._instance == null) {
            CardAssist._instance = new CardAssist();
            
        }
        return CardAssist._instance;
    }
}
export var Card = CardAssist.getInstance();