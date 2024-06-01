# Get the filename argument (assuming it's the first argument after the script name)
filename="$1"

# Check if filename is provided
if [ -z "$filename" ]; then
  echo "Error: Please provide a filename as an argument."
  exit 1
fi

# Escape spaces in the filename (optional, adjust escaping based on your shell)
escaped_filename="${filename// /-}"

# Construct the full command with dynamic filename
full_command="npx typeorm migration:create src/database/migrations/${escaped_filename}"

# Execute the full command
eval "$full_command"
