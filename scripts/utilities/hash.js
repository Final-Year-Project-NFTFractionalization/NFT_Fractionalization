function timestampHash() {
    let timestamp = Date.now().toString(); // Get current timestamp
    let hash = crypto.createHash('sha256'); // Create SHA-256 hash object
    hash.update(timestamp); // Update hash with timestamp
    return hash.digest('hex'); // Get hexadecimal representation of the hash
}
