
-- associate all entities to random users

SET @lid = 10;
SET @tid = 10009;

UPDATE `Bus` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
UPDATE `Garage` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
UPDATE `Line` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
UPDATE `LineStop` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
UPDATE `Station` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
UPDATE `StationSign` SET ownerId = FLOOR(@lid + RAND() * (@tid - @lid));
