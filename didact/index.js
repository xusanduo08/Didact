/** @jsx Didact.createElement */
import Didact from './Didact';

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

const appElement = <div><ul>{stories.map(storyElement)}</ul></div>;

function storyElement({ name, url }) {
  const likes = Math.ceil(Math.random() * 100);
  return (
    <li>
      <button>{likes}❤️</button>
      <a href={url}>{name}</a>
    </li>
  );
}
console.log(document.getElementById("root"));
Didact.render(appElement, document.getElementById("root"));