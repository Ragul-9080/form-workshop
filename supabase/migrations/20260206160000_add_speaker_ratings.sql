/*
  # Add Speaker Ratings

  1. Changes
    - Add `rating_ragul` (integer) column to `workshop_feedback` table
    - Add `rating_ashvini` (integer) column to `workshop_feedback` table
*/

ALTER TABLE workshop_feedback 
ADD COLUMN IF NOT EXISTS rating_ragul integer CHECK (rating_ragul >= 1 AND rating_ragul <= 5),
ADD COLUMN IF NOT EXISTS rating_ashvini integer CHECK (rating_ashvini >= 1 AND rating_ashvini <= 5);
