# Increment 2

This document lays out the implementation of the second SafeHaven Connect product iteration.

## Product Overview

SafeHaven Connect is a product designed to allow Emergency Shelters to share real-time needs with First Responders in the case of and emergency. The intent of this is to allow Emergency Shelters to receive basic supplies when critical infrastructure normally required for proper resource management is down.

## Dual-Frontend Design

The second project iteration is designed to add a basic backend that manages the state. It still maintains the 2-sided frontend that operate as 1.
The two frontend sides are:
- Emergency Shelter Side
- First Responder Side
It adds the Backend.

## Emergency Shelter Side

On the Emergency Shelter Side of the application, users are inherently tied to Emergency Shelters. They can update:
- Shelter Capacity
- Shelter Needs (e.g. Food, Water, Medical Supplies, etc)
- Other information (the "other information" must be consistent throughout the entire application)
They can also see Shelter Name and Shelter Location
Users select the shelter they are associated with on the shelter-side login page and can create a new shelter or select an existing shelter on the shelter-side registration page.
Shelters store the following information:
- Name
- Location (Coordinates)
- Capacity
- Needs (e.g. Food, Water, Medical Supplies, etc)
- Status (What level of action First Responders have/are taking)
- Other information (the "other information" must be consistent throughout the entire application)

## First Responder Side
On the Emergency Shelter Side, users have extensive read access throughout the entirety of the stored information, but limited write access. In fact, they can only modify Shelter Status.
First Responders can enter their coordinates to sort shelters by pure distance. This will enable them to help the shelters nearby.

## Backend

The backend will manage interaction with persistent data, from user info to shelter info. It will use a database.