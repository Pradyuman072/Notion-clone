function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash); // Use bitwise left shift to mix the hash
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase(); // Convert hash to hex
    return "#" + "00000".substring(0, 6 - c.length) + c; // Pad with zeros if necessary
}

export default stringToColor;