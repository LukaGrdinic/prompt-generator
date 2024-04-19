import { Injectable } from '@angular/core';

@Injectable()
export class PromptGeneratorService {

  schredingerSentenceCount = 0;

  constructor() {}


  generateSchredingerSentence() {
    switch (this.schredingerSentenceCount) {
      case 0:
        this.schredingerSentenceCount++;
        return this.generateFirstSchredingerSentence();
      case 1:
        this.schredingerSentenceCount++;
        return this.generateSecondSchredingerSentence();
      case 2:
        this.schredingerSentenceCount++;
        return this.generateThirdSchredingerSentence();
      default:
        return this.generateFirstSchredingerSentence();
    }
  }

  generateFirstSchredingerSentence() {
    const sentences = [
      `"And with the cat at home, it simply isn't viable at the moment", said Jen.`,
      `"Apatow... Why does that sound familiar?" - Greg mumbled while snatching the last canapé bite off the gawkishly tall server's tray. `,
      `Mr. Collins would always complain about how tired he was, so much so that it became white noise to those around him. `,
      `Mrs. Thompson had a habit of misplacing her glasses, only to find them in the most unexpected places, sparking small adventures in her otherwise unworldly days.`,
      `The sound of the old piano from 5B filled the building every Thursday night, a mystery performance that became the soundtrack of their lives.`,
      `For years, the daily crossword puzzle in the local paper had been Greg's solitary refuge until he noticed someone else was filling it out, one clue ahead of him.`,
      `Despite their antics being typical of childish shenanigans, the old grumpy man just couldn't let this one slide.`,
      `I wish these were a heartwarming quest to discover my true self, but alas, I find myself in the dreaded waiting room yet again.`,
      `In the background, the weatherman was mumbling in ambigouous platitudes - a language familiar to those uneager to challenge the status quo.`,
      `One sleepless night after another, he'd try to find relief in a feeble conviction that he did it for greater good.`,
      `Underneath her laughter, a truth was buried, not harsh, but undeniable.`,
    ];
    return this.randomize(sentences);
  }
  generateSecondSchredingerSentence() {
    const sentences = [
      `But that was before the secret was out.`,
      `With a single sentence, the past and future collided.`,
      `The message was clear, yet its implications were unimaginable.`,
      `Facing the mirror, the reflection posed an impossible question.`,
      `In the blink of an eye, alliances shifted in a way no one saw coming.`,
      `Oh, dear reader, I digress, as I often do.`,
      `Wait - was I the only one in the dark this whole time?`,
      `I can think of a thousand funny things right now; yes - I do feel deeply inappropriate.`,
      `A freshly baked cookie seemed like a perfect remedy.`,
      `Could it have been merely a dream?`,
      `A mere distraction: a brainwashed escape, absurdly foolish frolicking is all it was!`,
    ];
    return this.randomize(sentences);
  }
  generateThirdSchredingerSentence() {
    const sentences = [
      `Didn't I tell you a million times:`,
      `If that is the way you want it to be - fine!`,
      `Or did I make it all up?`,
      `All along, I thought you were on my side.`,
      `But can you trust me?`,
      `You know what, I changed my mind.`,
      `I don't ruin things - do I?`,
      `If only I could tell you what truly happenned.`,
      `Either that, or we're all tripping rainbows.`,
      `Could I elaborate? `,
      `I can hear my mother's voice...`,
    ];
    return this.randomize(sentences);
  }

  generateSentence(): string {
    return this.generateCharacterSentence();
  }

  private randomize(array: string[]): string {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  generateCharacterSentence(): string {
    const sentences = [
      `He hides a small leather notebook in his medicine drawer`,
      `Every day at 6 PM, she is seen entering a mysterious room/establishment`,
      `A psychologist is pressured by concerning, yet ethically confidential knowledge about their patient`,
      `A big city retiree relocates to a small town and makes an unsettling discovery`,
      `A big city retiree relocates to a small town and tries to fit in`,
      `they didn't know that begonias are poisonous to cats`,
      `he kept checking his phone, but his text remained on "seen"`,
      `she sat in the dark, contemplating Médée`,
      `every morning at exactly 11:43, he had his rooibos tea with two ladyfingers`,
      `A usually friendly and available person never answers their phone on Thursdays`,
      `(s)he sorts her/his books by color, not by author or genre`,
      `he has, yet again, forgotten to defrost the chicken`,
      `the contents of the pale pink envelope made her iracundulous`,
      `he urged himself to think his best shower thoughts`,
      `the rumor has it she faked her death`,
      `she made a delicious Stonefruit Berry Dacquoise`,
      `She found an old locket with a faded photograph.`,
      `Every morning, he took an extra-long route to work.`,
      `He carefully stored an antique key in a velvet box.`,
      `On her desk, a solitary white rose appeared daily.`,
      `She hummed her favorite song while doing the dishes.`,
      `He glanced at the empty seat across the table.`,
      `Every evening, he observed the sunset from the same park bench.`,
      `She wore a delicate bracelet with an engraved message.`,
      `He held an old letter, contemplating its worn edges.`,
      `She smiled at a stranger who looked oddly familiar.`,
      `He absentmindedly tapped his fingers on the steering wheel.`,
      `She kept a folded photograph hidden in her wallet.`,
      `He lingered at the flower shop, considering a single red rose.`,
      `She sipped her coffee, lost in thought at her usual cafe.`,
      `He noticed the laughter lines around her eyes.`,
      `She clutched her childhood stuffed animal while watching TV.`,
      `Every morning, he tied his shoelaces with precision.`,
      `She hesitated before pressing the elevator button.`,
      `He paused to admire a street artist's work.`,
      `She carried a small notebook filled with scribbles.`,
      `He ran his fingers over a faded photo in a frame.`,
      `She doodled in the margins of her meeting notes.`,
      `He wore a vintage watch with a scratched face.`,
      `She exchanged a knowing look with her best friend.`,
      `He waited for a delayed train at the same station.`,
      `She examined an old, chipped teacup with fondness.`,
      `He scanned the same bookshelf for an unread novel.`,
      `She sat in the park, watching children play.`,
      `He overheard a fragment of a conversation on the street.`,
      `She browsed an antique shop, drawn to old postcards.`,
      `He stopped to admire a colorful display of flowers.`,
      `She traced a scar on her palm, lost in thought.`,
      `He wore a faded T-shirt with a barely visible logo.`,
      `She paused to feel the warmth of the morning sun.`,
      `When it came to wicked woozies, her grandma was a regular trailblazer.`,
    ];

    return this.randomize(sentences);
  }

  generatePlacesSentence(): string {
    const sentences = [
      `5th floor of a public library`,
      `A remote lake`,
      `A spooky, sinister alley`,
      `"A shaky bridge in the nearby forest`,
      `"`,
      `Blatina, a small village on the north of ex-Yugoslavian republic of Montenegro`,
      `A Yugo 45 with expired licence plates`,
      `An abandoned factory`,
      `An outdoor concert, packed with audience`,
      `A lawyer's office`,
      `Martha Stewart's kitchen`,
      `The picnic spot at Meadowbreeze Lane`,
      `the yellow park bench on Sunshine Lane`,
      `the brickstone house at the end of Whispering Willow Way`,
      `13, Pebblebrook Drive`,
      `a state funded animal shelter`,
      `a private school history class`,
      `a small local diner`,
      `the hairdresser's salon`,
      `the arcade`,
      `a book fair`,
      `a shopping mall parking lot`,
      `a secluded little inn`,
      `A music studio`,
      `The church`,
      `A storage facility unit`,
      `The bank`,
      `Secret military base`,
      `Pawnshop`,
      `An ordinary, not so memorable little caffe `,
      `A river dock with intimidating reputation`,
      `Well hidden basement`,
      `An alternative theater, on the outskirts of the town`,
      `A seldom guesthouse on a desolate motorway`,
      `Gas station`,
    ];
    return this.randomize(sentences);
  }

  generateCircumstancesSentence(): string {
    const sentences = [
      `an unexpected storm`,
      `There is an otherwise unrelated police inquiry ongoing`,
      `There is a chain of unusual, unsettling events happening in a local community`,
      `A dark hooded figure has been sighted seemingly stalking certain households`,
      `there was no wallet in the bag`,
      `a mysterious gift appears on the doorstep`,
      `The long-awaited apology never arrived`,
      `The answer lies on the 76th page of`,
      `TikTok app is non-responsive`,
      `the cheesecake fell apart`,
      `the usually full laundry basked contained only two wet towels this morning`,
      `On the bookshelf, a solitary volume seemed out of place.`,
      `A stranger's glance held a hint of recognition.`,
    ];
    return this.randomize(sentences);
  }

  generatePropsSentence(): string {
    const sentences = [
      `a dehydrated piece of lemon that lost its aroma`,
      `a $6.41 bill`,
      `potato salad`,
      `a bag containing one frozen chocolate chip cookie without packaging date`,
      `a "CEASEFIRE" protest sign`,
      `52 7 18 16 25 38 `,
      `A crumpled postcard with an unreadable message.`,
      `A rusty bicycle chain with a broken link.`,
      `A faded photograph of a long-lost relative.`,
      `A handwritten letter with an unfinished confession.`,
      `A stack of mismatched, well-worn playing cards.`,
      `A jar of fireflies captured on a summer evening.`,
      `A box of old, scratched vinyl records.`,
      `A collection of seashells from a memorable beach trip.`,
      `A torn map with an "X" marking an unknown location.`,
      `A worn-out pair of ballet shoes with frayed ribbons.`,
      `A long shopping list with a three types of cheese checked off.`,
      `A set of keys with one odd, non-belonging, old key`,
      `A half-filled coffee cup with a lipstick stain.`,
      `A stack of unpaid bills on the kitchen table.`,
      `A well-worn backpack with various patches.`,
      `A family photo album with dog-eared pages.`,
      `A smartphone with a cracked screen.`,
      `A handwritten to-do list `,
      `A pair of mismatched socks on the floor`,
      `A collection of post-it notes with random scribbles.`,
    ];
    return this.randomize(sentences);
  }

  generateQuotesSentence(): string {
    const sentences = [
      `"I didn't think it mattered."`,
      `"Didn't you say we had milk at home?"`,
      `"Well, that changes everything."`,
      `"If I don't go now, I might never leave!"`,
      `"This might be our last scrapedown."`,
      `"Now then... Do they validate parking here?"`,
      `"Wow, biblical insults!"`,
      `"How did you get rid of her?"`,
      `"How about I abandon my children?"`,
      `"He couldn't have died at a worse time."`,
      `"Am I under arrest or not?"`,
      `"Trina does make a perfect cassoulet."`,
      `"And your point being?"`,
      `"I don't have time to keep up with the multitudes of people that this company employs."`,
    ];
    return this.randomize(sentences);
  }

  generateWhatsItAboutSentence(): string {
    const sentences = [
      `It's a story about escape`,
      `It's a dysfunctional relationship saga`,
      `It's a journey of self-discovery.`,
      `It's a quest for revenge.`,
      `It's a fight for survival.`,
      `It's a search for true love.`,
      `It's a battle against inner demons.`,
      `It's a pursuit of justice.`,
      `It's a test of friendship.`,
      `It's a clash of cultures.`,
      `It's a quest for happiness.`,
      `It's a race against time.`,
      `It's an exploration of the human condition.`,
      `It's a pursuit of lifelong dreams.`,
      `It's a conflict of values.`,
      `It's a lesson in humility.`,
      `It's a test of faith.`,
      `It's an unexpected alliance.`,
      `It's a battle of wits.`,
      `It's a search for redemption.`,
      `It's a saga of resilience.`,
      `It's an exploration of the unknown.`,
      `It's a race against global catastrophe.`,
      `It's a haunted house survival tale.`,
      `It's a forgotten civilization rediscovery.`,
      `It's a generational curse quest.`,
      `It's a journey through the afterlife.`,
      `It's a societal acceptance struggle.`,
      `It's a sentient AI's self-discovery.`,
      `It's a mission to prevent a time paradox.`,
      `It's an oceanic ancient secrets quest.`,
      `It's a battle against a malevolent entity.`,
      `It's a journey to find a fabled lost city.`,
      `It's a story of a family secret's revelation.`,
      `It's a struggle for survival in a post-apocalyptic desert.`,
      `It's a quest to decipher cryptic ancient texts.`,
      `It's an interdimensional adventure through parallel worlds.`,
      `It's an unlikely alliance in a dystopian future.`,
      `It's a cosmic mystery unfolding in a remote observatory.`,
      `It's a journey to mend a fractured friendship.`,
      `It's a search for a mythical creature in a mystical forest.`,
      `It's an epic space odyssey in search of a new home.`,
      `It's a rush to catch the morning bus.`,
      `It's a struggle to find a lost pet.`,
      `It's a quest to cook a perfect meal.`,
      `It's a journey to mend a broken relationship.`,
      `It's a competition to win a local talent show.`,
      `It's a challenge to organize a surprise party.`,
      `It's an adventure to fix a leaky faucet.`,
      `It's a race to meet the deadline.`,
      `It's a test of patience during a long commute.`,
      `It's a day of learning to ride a bike.`,
      `It's a journey to find a missing phone.`,
      `It's a struggle to quit a bad habit.`,
      `It's an attempt to make the perfect cup of coffee.`,
      `It's a mission to conquer a fear of public speaking.`,
      `It's a quest to find a misplaced passport.`,
      `It's a competition to win a neighborhood bake-off.`,
      `It's a challenge to assemble a piece of furniture.`,
      `It's an adventure to plan a last-minute road trip.`,
      `It's a race to finish a 1,000-piece jigsaw puzzle.`,
      `It's a test of memory to recall an old friend's name.`,
    ];
    return this.randomize(sentences);
  }
}
