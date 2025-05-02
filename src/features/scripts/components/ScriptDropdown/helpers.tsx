export const boldSubstring = (text: string, substring: string) => {
  const lowerText = text.toLowerCase();
  const lowerSubstring = substring.toLowerCase();
  const index = lowerText.indexOf(lowerSubstring);
  if (index >= 0) {
    return (
      <>
        {text.substring(0, index)}
        <strong>{text.substring(index, index + substring.length)}</strong>
        {text.substring(index + substring.length)}
      </>
    );
  }
  return text;
};
