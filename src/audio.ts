import {DateTime} from "luxon"

export function announce(text: string, dt?: DateTime)
{
  if (!('speechSynthesis' in window))
    return;

  if (dt)
    text = replaceText(text, dt);

    speak(text);
}

function replaceText(text: string, dt: DateTime): string
{
  const pos1 = text.indexOf("[");
  if (pos1 == -1)
    return text;
  const pos2 = text.indexOf("]");
  if (pos2 == -1 || pos2 <= pos1 + 1)
    throw new Error("invalid notify text: " + text);
  const tokenIncludingDelimiters = text.substr(pos1, pos2 - pos1 + 1);  
  const token = tokenIncludingDelimiters.substr(1, pos2 - pos1 - 1);
  //console.log(tokenIncludingDelimiters);
  //console.log(token);

  const newText = dt.toFormat(token);
  text = text.replace(tokenIncludingDelimiters, newText);
  //console.log(newText);

  if (text.indexOf("]") != -1)
    text = replaceText(text, dt);

  return text;
}

function speak(text: string)
{
  // Google Web Speech API
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
