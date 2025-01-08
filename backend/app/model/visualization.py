import argparse
import os
from functions import get_visualization

parser = argparse.ArgumentParser(description="run")

parser.add_argument('--path_video', type=str, default='D:\\emotional-response-recognition-in-surveys\\backend\\app\\model\\videos\\video_one.mp4', help='Path to all videos')
parser.add_argument('--path_report', type=str, default='report/', help='Path to save the report')
parser.add_argument('--path_save_video', type=str, default='result_videos/', help='Path to save the result videos')
parser.add_argument('--conf_d', type=float, default=0.7, help='Elimination threshold for false face areas')


args = parser.parse_args()

# def pred_all_video():
#     path_all_videos = os.listdir(args.path_video)
#     label_model = ['Neutral', 'Happiness', 'Sadness', 'Surprise', 'Fear', 'Disgust', 'Anger']
#     if not os.path.exists(args.path_save_video):
#         os.makedirs(args.path_save_video)
#     for id, cr_path in enumerate(path_all_videos):
#         print('{}/{}'.format(id+1, len(path_all_videos)))
#         print('Name video: ', os.path.basename(cr_path))
#         name_video = os.path.basename(cr_path)
#         name_report = os.path.basename(cr_path)[:-4] + '.csv'
        
#         detect = get_visualization.VideoCamera(path_video=os.path.join(args.path_video, cr_path),
#                                             path_report=os.path.join(args.path_report, name_report),
#                                             path_save=os.path.join(args.path_save_video, name_video[:-4]),
#                                             name_labels=label_model, 
#                                             conf=args.conf_d)
#         detect.get_video()
#         print('Ressult saved in: ', os.path.join(args.path_save_video,name_video[:-4] + '.mp4'))

def pred_all_video():
    label_model = ['Neutral', 'Happiness', 'Sadness', 'Surprise', 'Fear', 'Disgust', 'Anger']
    
    # Tworzenie folderu na wyniki, jeśli nie istnieje
    if not os.path.exists(args.path_save_video):
        os.makedirs(args.path_save_video)
    
    # Sprawdzenie, czy ścieżka wskazuje na plik
    if os.path.isfile(args.path_video):
        # Pojedynczy plik wideo
        videos_to_process = [args.path_video]
    elif os.path.isdir(args.path_video):
        # Folder z wieloma plikami wideo
        videos_to_process = [
            os.path.join(args.path_video, file)
            for file in os.listdir(args.path_video)
            if file.endswith(('.mp4', '.avi', '.mkv'))  # Obsługiwane formaty
        ]
    else:
        raise FileNotFoundError(f"Ścieżka '{args.path_video}' nie istnieje ani nie jest plikiem!")

    # Przetwarzanie wideo
    for id, cr_path in enumerate(videos_to_process):
        print(f'{id+1}/{len(videos_to_process)}')
        print('Name video: ', os.path.basename(cr_path))
        
        name_video = os.path.basename(cr_path)
        name_report = name_video[:-4] + '.csv'
        
        detect = get_visualization.VideoCamera(
            path_video=cr_path,
            path_report=os.path.join(args.path_report, name_report),
            path_save=os.path.join(args.path_save_video, name_video[:-4]),
            name_labels=label_model, 
            conf=args.conf_d
        )
        detect.get_video()
        print('Result saved in: ', os.path.join(args.path_save_video, name_video[:-4] + '.mp4'))

        
if __name__ == "__main__":
    pred_all_video()