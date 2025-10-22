#!/bin/bash

# NestJS Demo - Database Setup Script

echo "Setting up the database for NestJS Demo..."

# Check if PostgreSQL container is running
if ! docker ps | grep -q pgsql-infra; then
    echo "Error: PostgreSQL container 'pgsql-infra' is not running."
    echo "Please start the container first:"
    echo "  docker start pgsql-infra"
    exit 1
fi

echo "PostgreSQL container is running."

# Create users table
echo "Creating users table..."
docker exec -i pgsql-infra psql -U postgres -d northwind < database/init-users.sql

if [ $? -eq 0 ]; then
    echo "✓ Users table created successfully!"
else
    echo "✗ Failed to create users table. It may already exist."
fi

echo ""
echo "Database setup complete!"
echo ""
echo "You can now start the application with:"
echo "  npm run start:dev"
