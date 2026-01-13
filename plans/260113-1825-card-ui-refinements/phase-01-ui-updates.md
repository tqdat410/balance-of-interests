# Phase 1: Remove Shadows & Update Effect Format

## Objectives

- Remove shadow classes from `GameActionButtons.tsx`.
- Refactor the effect display logic to match "Label:Number" format without signs, coloring only the number.

## Tasks

### Implementation
1. **Update `app/components/GameActionButtons.tsx`**:
   - Remove `hover:shadow-xl` and `clay-card` (if it adds shadow).
   - Update the effects mapping:
     - Remove `+` prefix for positive numbers.
     - Use `Math.abs(value)` to remove `-` sign? User said "bỏ dấu +/-", implying just the magnitude?
     - Example: "N:7" (red or green depending on value).
     - Wait, if value is -7, and I remove sign, it becomes 7. The color indicates positive/negative.
     - Red = Negative? Green = Positive? Or Red/Green based on entity type?
     - User said "chỉ đỏ/xanh số" (only red/green number).
     - Standard game logic: Green = Good (Increase?), Red = Bad (Decrease?).
     - Actually, "N:7" (Red) usually means -7? Or does it mean +7 but Red color?
     - Context: "bỏ dấu +/- chỉ cần màu xanh/đỏ là đủ".
     - I will assume: Green = Positive (+), Red = Negative (-).
     - Display: `Label : Number` (absolute value).

### Testing
1. Verify cards are flat.
2. Verify effects look like `N: 7` with 7 colored Green if +7, Red if -7.

### Code Review
1. Ensure readability.
