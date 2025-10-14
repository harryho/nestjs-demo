#!/bin/bash

# NestJS Demo - Database Setup Script

echo "Setting up the database for NestJS Demo..."

# Check if PostgreSQL container is running
if ! docker ps | grep -q postgres-infra; then
    echo "Error: PostgreSQL container 'postgres-infra' is not running."
    echo "Please start the container first:"
    echo "  docker start postgres-infra"
    exit 1
fi

echo "PostgreSQL container is running."

# Create users table
echo "Creating users table..."
docker exec -i postgres-infra psql -U postgres -d northwind < database/init-users.sql

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
