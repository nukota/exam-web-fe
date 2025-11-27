export interface Choice {
  choice_id: string;
  question_id: string;
  choice_text: string;
}

export interface UpdateChoiceDTO {
  choice_id: string; // Temp ID for new choices (format: 'temp_<uuid>'), or real UUID for existing choices
  choice_text: string;
}

export interface ReviewChoiceDTO extends Choice {
  is_correct: boolean;
  is_chosen: boolean;
}
