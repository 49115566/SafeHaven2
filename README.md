# Increment 1

This document lays out the implementation of the initial SafeHaven Connect product.

## Product Overview

SafeHaven Connect is a product designed to allow Emergency Shelters to share real-time needs with First Responders in the case of and emergency. The intent of this is to allow Emergency Shelters to receive basic supplies when critical infrastructure normally required for proper resource management is down.

## Dual-Frontend Design

The initial project is designed to avoid all forms of a proper backend, from databases to backend services. Instead, it operates on a double-sided frontend that work via shared state.
The two frontend sides are:
- Emergency Shelter Side
- First Responder Side

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

## Shared Pieces

Naturally, shared pieces of the architecture are required as there is no proper backend. The entirety of the shelter and user information will be stored in local memory and lost easily. Consequently, the following is needed:
- A structured manner to store shelter and user information locally
- A way to persist this while actively using the webpage
- A page for choosing application side
It is important that users are able to transition from Emergency Shelter Side to First Responder Side (and back and forth) in one session without losing the data so that they can function with actual data.